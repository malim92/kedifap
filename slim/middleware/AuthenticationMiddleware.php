<?php

namespace Middleware;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response;

class AuthenticationMiddleware
{
    public function __invoke(Request $request, RequestHandler $handler): Response
    {
        // Check if the user is authenticated
        if (!$this->isAuthenticated()) {
            // Redirect to the login page or return an error response
            $response = new Response();
            $response = $response->withHeader('Location', '/login')->withStatus(302);
            return $response;
        }

        // If the user is authenticated, continue to the next middleware
        return $handler->handle($request);
    }

    private function isAuthenticated(): bool
    {
        $username = 'C1001';
        $password = 'AF6637M';
        // Check if the user is authenticated
        // Return true if authenticated, false otherwise
        $date = date('Y-m-d');
        $date_start = date('Y-m-d', strtotime("-3 days"));
        $url = 'https://server1.kedifap.com:8082/PriorityAPI/api/Invoice/GetAll?fromDate=' . $date_start . '&toDate=' . $date . '&onlyHeaders=false&invType=ALL';
        //https://server1.kedifap.com:8082/PriorityAPI/api/Invoice/GetAll?fromDate=2023-04-04&toDate=2023-04-07&onlyHeaders=false&invType=ALL
        $options = array(
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false, // disable SSL verification
            CURLOPT_URL => $url
        );
        $ch = curl_init($url);
        curl_setopt_array($ch, $options);

        $headers = array(
            'Content-Type: application/json',
            'Authorization: Basic ' . base64_encode("$username:$password")
        );
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        $results = curl_exec($ch);
        //}
        // $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE); 
        //print_r($results);
        if (!$results) {
            //die('Error: "' . curl_error($ch) . '" - Code: ' . curl_errno($ch));
            return false;
        } else {
            echo  'here ';
            return true;
        }
    }
}
