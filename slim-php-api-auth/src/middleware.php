<?php


use \Firebase\JWT\JWT;
use \Slim\Middleware\HttpBasicAuthentication\AuthenticatorInterface;

// not working
//use \Slim\Middleware\Session as SessionMiddleware;

//basic auth 

class AuthenticatorClass implements AuthenticatorInterface
{

    public function __invoke(array $arguments)
    {
        $user = $arguments['user'];
        $password = $arguments['password'];

        if ($user == 'ramy' && $password == "1234") {

            return true;
        } else {

            return false;
        }
    }
}

$container = $app->getContainer();

$container["jwt"] = function ($container) {
    return new StdClass;
};

$DOTENV_FILE = dirname(__DIR__, 1) . '/.env';
$dotenv_contents = file_get_contents($DOTENV_FILE);
$dotenv_vars = parse_ini_string($dotenv_contents);

$app->add(new \Slim\Middleware\HttpBasicAuthentication(
    [
        'path' => '/token', 'authenticator' => new AuthenticatorClass()
    ]

));

// Register the session middleware
// not working
// $app->add(new SessionMiddleware([
//     'name' => 'my-session',
//     'autorefresh' => true,
//     'lifetime' => '1 hour'
// ]));

$app->add(new \Slim\Middleware\JwtAuthentication([
    "path" => ["/"],
    "passthrough" => ["/authenticate", "/", "/test",  '/validate-token', '/front', '/login'],
    "secret" => $dotenv_vars['SECRET'],
    "callback" => function ($request, $response, $arguments) use ($container) {
        $container["jwt"] = $arguments["decoded"];
        echo (json_encode($arguments["decoded"]));
    },
    "error" => function ($request, $response, $arguments) {
        $data["status"] = "error";
        $data["message"] = $arguments["message"];die;
        return $response
            ->withHeader("Content-Type", "application/json")
            ->write(json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
    }
]));


$app->add(new \Tuupola\Middleware\CorsMiddleware([
    "origin" => ["*"],
    "methods" => ["GET", "POST", "PUT", "PATCH", "DELETE"],
    "headers.allow" => ["Accept", "Content-Type"],
    "headers.expose" => [],
    "credentials" => false,
    "cache" => 0,
]));


$app->add(function ($req, $res, $next) {
    $response = $next($req, $res);
    return $response
        //->withHeader('Access-Control-Allow-Origin', 'https://kedi-app.com2go.co/')
        ->withHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        ->withHeader('Access-Control-Allow-Credentials', 'true');
});






































//middleware
/*
$app->add(function($req,$res,$next){

$res->getBody()->write("befor");
$res=$next($req,$res);
$res->getBody()->write("after");

return $res;




});
*/
