<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \Firebase\JWT\JWT;



require '../vendor/autoload.php';
require '../src/config/db.php';

//Dotenv is not working
$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__, 1));
$dotenv->load();
$app_secret = getenv('SECRET');
//print_r($app_secret);

$conf = [
    'settings' => [
        'displayErrorDetails' => true,
    ],
];

$c = new \Slim\Container($conf);
$app = new \Slim\App($c);

require '../src/middleware.php';
require '../src/DI.php';
$container["jwt"] = function ($container) {
    return new StdClass;
};


// Display the login page
$app->get('/', function (Request $request, Response $response, $args) {
    session_start();
    $errorParam = $request->getParam('error');
    if (isset($errorParam)) {
        $flash = $this->get('flash');
        $flash->addMessage('error', 'Please login first.');
    }
    $flash = $this->get('flash');
    $messages = $flash->getMessages();
    if (isset($messages['error'])) {
        foreach ($messages['error'] as $error) {
            echo '<div class="alert alert-danger">' . $error . '</div>';
        }
    }
    $response->getBody()->write(file_get_contents(__DIR__ . '/../templates/login.php'));
    return $response;
});

// Register
$app->post('/register', function (Request $request, Response $response) {
    $first_name = $request->getParam('name');
    $phone = $request->getParam('phone');
    $email = $request->getParam('email');
    $address = $request->getParam('address');

    $sql = "INSERT INTO test (name,email,phone,address) VALUES
    (:name,:email,:phone,:address)";

    try {
        // Get DB Object
        $db = new db();
        // Connect
        $db = $db->connect();

        $stmt = $db->prepare($sql);

        $stmt->bindParam(':name', $first_name);
        $stmt->bindParam(':email',      $email);

        $stmt->bindParam(':phone',      $phone);
        $stmt->bindParam(':address',    $address);

        $stmt->execute();

        echo '{"notice": {"text": "Customer Added"}';
    } catch (PDOException $e) {
        echo '{"error": {"text": ' . $e->getMessage() . '}';
    }
});


// Authenticate
$app->post('/authenticate', function (Request $request, Response $response) {
    session_start();

    $dotenv_file = dirname(__DIR__, 1) . '..\.env';
    $dotenv_contents = file_get_contents($dotenv_file);
    $dotenv_vars = parse_ini_string($dotenv_contents);

    //$name = $request->getParam('name');
    $params = $request->getParsedBody();
    $name = $params['username'] ?? '';
    //echo $name;die;
    $sql = "SELECT * FROM test WHERE name = '$name'";
    try {
        // Get DB Object
        $db = new db();
        // Connect
        $db = $db->connect();

        $stmt = $db->query($sql);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user['name'] == $name) {

            $MyJWT = $this->JWT;
            $now = new DateTime();
            $future = new DateTime("now +20 minutes");
            $server = $request->getParams();
            $payload = [
                "iat" => $now->getTimeStamp(),
                "exp" => $future->getTimeStamp(),
                "sub" => $server,
            ];
            $secret = $dotenv_vars['SECRET'];


            $token = $MyJWT->encode($payload, $secret, "HS512");
            $data["success"] = true;
            $data["token"] = $token;
            $data["user"] = $user;

            // set the token in a cookie
            $cookie_lifetime = 60 * 20; // 20 minutes
            $cookie_params = session_get_cookie_params();
            setcookie('jwt_token', $token, time() + $cookie_lifetime, $cookie_params['path'], $cookie_params['domain'], $cookie_params['secure'], $cookie_params['httponly']);


            $response->withHeader("Content-Type", "application/json")
                ->write(json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
            return $response->withStatus(302)->withHeader('Location', 'http://localhost:3000/');
        } else {
            $flash = $this->get('flash');
            $flash->addMessage('error', 'Invalid username or password.');
            return $response->withStatus(302)->withHeader('Location', '/login');
            //return '{"success": "false", "msg": "User not found"}';
        }
    } catch (PDOException $e) {
        echo '{"error": {"text": ' . $e->getMessage() . '}';
    }
});

$app->post('/validate-token', function ($request, $response, $args) {
    // $data = array('message' => 'Hello from the backend!');
    // return $response->withJson($data);

    $dotenv_file = dirname(__DIR__, 1) . '..\.env';
    $dotenv_contents = file_get_contents($dotenv_file);
    $dotenv_vars = parse_ini_string($dotenv_contents);

    $token = $request->getHeader('Authorization')[0];
    //$token = json_decode($request->getBody())->token;
    $token_parts = explode(' ', $token);


    if ($token_parts[0] === 'Bearer') {
        $token = $token_parts[1];
    }
    $permissions = 'admin';

    if (!$token) {
        //return $response->withStatus(202)->withJson(['error' => 'Unauthorized']);
        return $response->withStatus(200)->withJson(['isTokenValid' => false]);
    }
    try {
        $decoded = JWT::decode($token, $dotenv_vars['SECRET'], array('HS512'));
        //return $response->withStatus(200)->withJson(['message' => 'Token is valid']);
        return $response->withStatus(200)->withJson(['isTokenValid' => true]);
    } catch (\Throwable $th) {

        return $response->withStatus(404)->withJson(['error' => 'Unauthorized']);
    }
});



$app->get('/hello/{name}', function (Request $request, Response $response, array $args) {
    $name = $args['name'];
    $response->getBody()->write("Hello, $name");

    return $response;
});



$app->run();
