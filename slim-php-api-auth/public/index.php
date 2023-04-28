<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \Firebase\JWT\JWT;
use GuzzleHttp\Client;



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
    $sql = "SELECT * FROM customers WHERE CUSTNAME = '$name'";
    try {
        // Get DB Object
        $db = new db();
        // Connect
        $db = $db->connect();

        $stmt = $db->query($sql);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user['CUSTNAME'] === $name) {

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
            //return $response->withStatus(302)->withHeader('Location', 'https://kedi-app.com2go.co/');
        } else {
            $flash = $this->get('flash');
            $flash->addMessage('error', 'Invalid username or password.');
            return $response->withStatus(302)->withHeader('Location', '/');
            //return '{"success": "false", "msg": "User not found"}';
        }
    } catch (PDOException $e) {
        echo '{"error": {"text": ' . $e->getMessage() . '}';
    }
});

$app->post('/validate-token', function ($request, $response, $args) {
    // $data = array('message' => 'Hello from the backend!');
    // return $response->withJson($data);
    $file = '../log.txt'; // path to file
    file_put_contents($file, 'here 1', FILE_APPEND);
    $dotenv_file = dirname(__DIR__, 1) . '..\.env';
    $dotenv_contents = file_get_contents($dotenv_file);
    $dotenv_vars = parse_ini_string($dotenv_contents);

    $token = $request->getHeader('Authorization')[0];
    //$token = json_decode($request->getBody())->token;
    $token_parts = explode(' ', $token);

    file_put_contents($file, 'here 2', FILE_APPEND);
    if ($token_parts[0] === 'Bearer') {
        $token = $token_parts[1];
    }
    $permissions = 'admin';


    $content = 'This is example text.'; // content to write

    if (!$token) {
        //return $response->withStatus(202)->withJson(['error' => 'Unauthorized']);
        return $response->withStatus(200)->withJson(['isTokenValid' => false]);
    }
    file_put_contents($file, 'here 3', FILE_APPEND);
    try {
        $decoded = JWT::decode($token, $dotenv_vars['SECRET'], array('HS512'));
        $data_string = serialize($decoded);
        //file_put_contents($file, gettype($decoded) , FILE_APPEND);
        file_put_contents($file, $data_string, FILE_APPEND);
        //print_r($decoded);
        //die;
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
//http://localhost:8000/?page=0
$app->get('/parts/', function (Request $request, Response $response, array $args) {
    $partsObject = [];
    $page = $request->getQueryParams('page')['page'];
    $size = $request->getQueryParams('size')['size'];
    $sorting = $request->getQueryParams('sorting')['sorting'];
    $columnFilter = $request->getQueryParams('filters')['filters'];
    $globalFilter = $request->getQueryParams('globalFilter')['globalFilter'];
    //print_r($columnFilter ) ; die;
    $page *= 100;
    $dotenv_file = dirname(__DIR__, 1) . '..\.env';
    $dotenv_contents = file_get_contents($dotenv_file);
    $dotenv_vars = parse_ini_string($dotenv_contents);

    $sortingQuery = '';
    $filterQuery = '';

    $toalRows = "SELECT COUNT(PARTNAME) FROM parts";

    if (!empty(json_decode($sorting))) {
        $soringArray = json_decode($sorting);
        $columnId = $soringArray[0]->id;
        $sortDirection = $soringArray[0]->desc;
        $sortDirection = !empty($sortDirection) ? 'DESC' : 'ASC';
        $sortingQuery = "ORDER BY $columnId $sortDirection";
        // print_r($columnId);
        // print_r($sortDirection ) ; die;
    }

    if (!empty(json_decode($columnFilter)) && !empty($columnFilter)) {
        $columnFilterArray = json_decode($columnFilter);
        $columnId = $columnFilterArray[0]->id;
        $filterValue = $columnFilterArray[0]->value;
        $filterQuery = "WHERE $columnId LIKE :filterValue";
        // print_r($columnId);

    }

    $sql = "SELECT * FROM parts $filterQuery $sortingQuery LIMIT :size OFFSET :page";

    if ($globalFilter !== '' && $globalFilter !== null) {
        $sql = "SELECT * FROM parts WHERE PARTNAME OR PARTDES LIKE :globalFilter " . $sortingQuery;
    }


    try {
        // Get DB Object
        $db = new db();
        // Connect
        $db = $db->connect();

        $stmt = $db->prepare($sql);
        //sorting enabled 
        // if (!empty(json_decode($sorting))){
        //     $stmt->bindValue(':columnId', $columnId, PDO::PARAM_STR);
        //     $stmt->bindValue(':sortDirection', $sortDirection, PDO::PARAM_STR);
        // }
        //column search

        if (!empty(json_decode($columnFilter)) && !empty($columnFilter)) {
            $stmt->bindValue(':filterValue', '%' . $filterValue . '%', PDO::PARAM_STR);
        }

        //user search
        if ($globalFilter !== '' && $globalFilter !== null) {
            $stmt->bindValue(':globalFilter', '%' . $globalFilter . '%', PDO::PARAM_STR);
        } else {
            $stmt->bindValue(':size', $size, PDO::PARAM_INT);
            $stmt->bindValue(':page', $page, PDO::PARAM_INT);
        }
        //$stmt->debugDumpParams();die;
        $stmt->execute();
        $parts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        //$toalRows= $stmt->fetch(PDO::FETCH_ASSOC);
        $toalRows = current($db->query($toalRows)->fetch());
        $partsObject = ["totalRows" => $toalRows, "data" => $parts];
        return $response->withStatus(200)->withJson($partsObject);
    } catch (PDOException $e) {
        echo '{"error": {"text": ' . $e->getMessage() . '}';
    }

    return $response;
});

$app->post('/order', function (Request $request, Response $response) { {
    //https://ked.priority-software.com.cy/odata/Priority/tabula.ini/efk/B2B_ORDERS
        $order = $request->getParsedBody();
        $username = 'apiuser';
        $password = '1234';

        $client = new Client([
            'base_uri' => 'https://ked.priority-software.com.cy/',
            //'base_uri' => 'https://webhook.site/',
            'headers' => [
                'Authorization' => 'Basic ' . base64_encode("$username:$password")
            ],
            'verify' => false
        ]);

        $response = $client->post('/odata/Priority/tabula.ini/efk/B2B_ORDERS', [
            'json' => $order,
        ]);
        
        $body = (string) $response->getBody();
        $data = json_decode($body, true);
        return $data;
        // try {
        //     return $response->withStatus(200)->withJson($data);
        // } catch (\Throwable $th) {
        //     return $response->withStatus(200)->withJson($th);
        // }
    }
});


$app->run();
