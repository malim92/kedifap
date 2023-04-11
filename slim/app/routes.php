<?php
declare(strict_types=1);

use App\Application\Actions\User\ListUsersAction;
use App\Application\Actions\User\ViewUserAction;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;

return function (App $app) {
    $app->options('/{routes:.*}', function (Request $request, Response $response) {
        // CORS Pre-Flight OPTIONS Request Handler
        return $response;
    });

    $app->get('/', function (Request $request, Response $response) {
        $response->getBody()->write('
            <form class="form-signin" method="POST" action="/login">
                <h2 class="form-signin-heading">Please sign in</h2>
                <label for="inputUsername" class="sr-only">Username</label>
                <input type="text" id="inputUsername" name="username" class="form-control" placeholder="Username" required autofocus>
                <label for="inputPassword" class="sr-only">Password</label>
                <input type="password" id="inputPassword" name="password" class="form-control" placeholder="Password" required>
                <div class="checkbox">
                    <label>
                        <input type="checkbox" value="remember-me"> Remember me
                    </label>
                </div>
                <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
            </form>
        ');
    
        return $response;
    });

    $app->post('/login', function (Request $request, Response $response) {
        $username = $request->getParsedBody()['username'] ?? '';
        $password = $request->getParsedBody()['password'] ?? '';
        print_r("username is $username");
        die;
        // TODO: validate username and password
        
        // TODO: check if username and password are valid
        // and set a session variable to indicate that the user is logged in
        
        // Redirect to home page after successful login
        return $response->withHeader('Location', 'http://localhost:3000')->withStatus(302);
    });

    
    $app->group('/users', function (Group $group) {
        $group->get('', ListUsersAction::class);
        $group->get('/{id}', ViewUserAction::class);
    });
};
