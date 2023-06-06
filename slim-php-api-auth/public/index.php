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


$app->add(function ($req, $res, $next) {
    $response = $next($req, $res);
    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', '*');
});

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
    $pass = $params['password'] ?? '';
    //echo $name;die;
    $sql = "SELECT * FROM customers WHERE DEXT_USERLOGIN = '$name'";    //echo $name;die;
    try {
        // Get DB Object
        $db = new db();
        // Connect
        $db = $db->connect();

        $stmt = $db->query($sql);
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $data["success"] = false;
        $data["token"] = null;
        $status = 404;
        foreach ($users as $user) {
            //print_r($user['CUSTNAME']) ;

            if ($user['DEXT_USERLOGIN'] === $name && $user['DEXT_PASSWORD'] === $pass) {

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
                $status = 200;
                //->withStatus(302)->withHeader('Location', 'https://kedi-app.com2go.co');
                //return $response->withStatus(302)->withHeader('Location', 'http://localhost:3000/');
                //return $response->withStatus(302)->withHeader('Location', 'https://kedi-app.com2go.co');
            }
        }
        return $response->withStatus($status)->withHeader("Content-Type", "application/json")
            ->write(json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT))
            ->withHeader('Access-Control-Allow-Origin', 'https://kedi-app.com2go.co');
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


//http://localhost:8000/?page=0
$app->get('/parts/', function (Request $request, Response $response, array $args) {
    $partsObject = [];
    $page = $request->getQueryParams('page')['page'];
    $size = $request->getQueryParams('size')['size'];
    $sorting = $request->getQueryParams('sorting')['sorting'];
    $columnFilter = $request->getQueryParams('filters')['filters'];
    $customColumnFilter = $request->getQueryParams('customFilters')['customFilters'];
    $isVendor = '';
    $discountedFilter = '';

    if (isset($request->getQueryParams('isVendor')['isVendor']))
        $isVendor = $request->getQueryParams('isVendor')['isVendor'];

    if (isset($request->getQueryParams('discountFilter')['discountFilter']))
        $discountedFilter = $request->getQueryParams('discountFilter')['discountFilter'];

    $globalFilter = $request->getQueryParams('globalFilter')['globalFilter'];
    $page *= 100;
    $dotenv_file = dirname(__DIR__, 1) . '..\.env';
    $dotenv_contents = file_get_contents($dotenv_file);
    $dotenv_vars = parse_ini_string($dotenv_contents);

    $sortingQuery = '';
    $filterQuery = '';
    $customFilterQuery = '';
    $discountedFilterQuery = '';
    $isVendorQuery = '';
    $globalFilterDiscount = '';
    $and = '';
    $where = '';


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
        $where = ' WHERE ';
        $filterQuery = "$columnId LIKE :filterValue";
        $and = ' AND ';
        // print_r($columnId);
    }
    if (!empty(json_decode($customColumnFilter)) && !empty($customColumnFilter)) {
        $customColumnFilterArray = json_decode($customColumnFilter);
        $columnId = $customColumnFilterArray[0]->id;
        $custonFilterValue = $customColumnFilterArray[0]->value;
        $where = ' WHERE ';
        $customFilterQuery = "$columnId LIKE :customFilterValue";
        $and = ' AND ';
    }

    if (!empty(json_decode($isVendor)) && !empty($isVendor)) {
        $isVendorArray = json_decode($isVendor);
        $isVendorValue = $isVendorArray[0]->value;
        // print_r($isVendorValue) ; die;
        $where = ' WHERE ';
        $isVendorQuery = "SUPNAME LIKE :isVendor";
    }

    $and2 = '';
    // if ($customFilterQuery !== '') $and2 = ' AND ';
    // else $and = '';
    // if ($filterQuery == '') $and = '';

    if ($filterQuery == '' && $customFilterQuery == '') {
        $and = '';
        $and2 = '';
    }
    if ($filterQuery == '' && $customFilterQuery !== '') {
        $and = '';
        $and2 = ' AND ';
        if ($isVendorQuery == '') $and2 = '';
    }
    if ($filterQuery !== '' && $customFilterQuery == '') {
        if ($isVendorQuery !== '') {
            $and = ' AND ';
            $and2 = '';
        } else {
            $and = '';
        }
    }
    if ($filterQuery !== '' && $customFilterQuery !== '') {
        if ($isVendorQuery !== '') {
            $and = ' AND ';
            $and2 = ' AND ';
        } else $and2 = '';
    }

    // $and = '' ? $filterQuery == '' :
    $sql = "SELECT * FROM parts $where $filterQuery $and $customFilterQuery $and2 $isVendorQuery $sortingQuery LIMIT :size OFFSET :page";
    $totalRowsQuery = "SELECT COUNT(PARTNAME) FROM parts $where $filterQuery $and $customFilterQuery $and2 $isVendorQuery";

    // echo $sql;die;

    if (!empty(json_decode($discountedFilter)) && !empty($discountedFilter)) {
        $discountedFilterArray = json_decode($discountedFilter);
        $discountedFilterValue = $discountedFilterArray[0]->value;
        $and2 = '';
        if ($customFilterQuery !== '') $and2 = ' AND ';
        $sql = "SELECT * FROM parts INNER JOIN discount ON parts.PARTNAME = discount.DEXT_OFFERPARTNAME $where $filterQuery $and $customFilterQuery $and2 $isVendorQuery $sortingQuery LIMIT :size OFFSET :page";
        $globalFilterDiscount = " INNER JOIN discount ON parts.PARTNAME = discount.DEXT_OFFERPARTNAME ";
        $totalRowsQuery = "SELECT COUNT(PARTNAME) FROM parts INNER JOIN discount ON parts.PARTNAME = discount.DEXT_OFFERPARTNAME $where $filterQuery $and $customFilterQuery $and2 $isVendorQuery";
        // var_dump($sql);die;

    }
    //global search
    if ($globalFilter !== '' && $globalFilter !== null) {
        if ($isVendorQuery !== '') $and = ' AND ';
        else $and = '';
        if ($filterQuery !== '') $and2 = ' AND ';
        else $and2 = '';
        $sql = "SELECT * FROM parts $globalFilterDiscount WHERE PARTNAME OR PARTDES LIKE :globalFilter $and $isVendorQuery $and2 $filterQuery $sortingQuery";
        $totalRowsQuery = "SELECT COUNT(PARTNAME) FROM parts $globalFilterDiscount WHERE PARTNAME OR PARTDES LIKE :globalFilter $and $isVendorQuery $and2 $filterQuery";
    }

    try {
        // Get DB Object
        $db = new db();
        // Connect
        $db = $db->connect();

        $stmt = $db->prepare($sql);
        $countStmt = $db->prepare($totalRowsQuery);
        //sorting enabled 
        // if (!empty(json_decode($sorting))){
        //     $stmt->bindValue(':columnId', $columnId, PDO::PARAM_STR);
        //     $stmt->bindValue(':sortDirection', $sortDirection, PDO::PARAM_STR);
        // }

        //column search
        if (!empty(json_decode($columnFilter)) && !empty($columnFilter)) {
            $stmt->bindValue(':filterValue', '%' . $filterValue . '%', PDO::PARAM_STR);
            $countStmt->bindValue(':filterValue', '%' . $filterValue . '%', PDO::PARAM_STR);
        }
        if (!empty(json_decode($customColumnFilter)) && !empty($customColumnFilter)) {
            $stmt->bindValue(':customFilterValue', '%' . $custonFilterValue . '%', PDO::PARAM_STR);
            $countStmt->bindValue(':customFilterValue', '%' . $custonFilterValue . '%', PDO::PARAM_STR);
        }
        if (!empty(json_decode($isVendor)) && !empty($isVendor)) {
            $stmt->bindValue(':isVendor', '%' . $isVendorValue . '%', PDO::PARAM_STR);
            $countStmt->bindValue(':isVendor', '%' . $isVendorValue . '%', PDO::PARAM_STR);
        }
        // if (!empty(json_decode($discountedFilter))) {
        //     $stmt->bindValue(':discountedFilterValue', '%' . $discountedFilterValue . '%', PDO::PARAM_BOOL);
        // }

        //user search
        if ($globalFilter !== '' && $globalFilter !== null) {
            $stmt->bindValue(':globalFilter', '%' . $globalFilter . '%', PDO::PARAM_STR);
            $countStmt->bindValue(':globalFilter', '%' . $globalFilter . '%', PDO::PARAM_STR);
            if (isset($filterValue) ) {
                $stmt->bindValue(':filterValue', '%' . $filterValue . '%', PDO::PARAM_STR);
                $countStmt->bindValue(':filterValue', '%' . $filterValue . '%', PDO::PARAM_STR);
            }
        } else {
            $stmt->bindValue(':size', $size, PDO::PARAM_INT);
            $stmt->bindValue(':page', $page, PDO::PARAM_INT);
            // print_r($size);die;
        }
        // print_r($globalFilter);die;
        // $countStmt->debugDumpParams();
        // die;
        // $stmt->execute();
        $stmt->execute();
        $parts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        // print_r($stmt);die;
        // var_dump($parts);die;

        //$toalRows= $stmt->fetch(PDO::FETCH_ASSOC);

        // $toalRows = current($db->query($toalRows)->fetch());
        $countStmt->execute();
        $totalRows = current($countStmt->fetch());
        // print_r($totalRows);die;
        $partsObject = ["totalRows" => $totalRows, "data" => $parts];
        return $response->withStatus(200)->withJson($partsObject);
    } catch (PDOException $e) {
        echo '{"error": {"text": ' . $e->getMessage() . '}';
    }

    return $response;
});

$app->post('/order', function (Request $request, Response $response) { {
        //https://ked.priority-software.com.cy/odata/Priority/tabula.ini/efk/B2B_ORDERS
        $order = $request->getParsedBody();
        // print_r($order);die;
        $username = 'apiuser';
        $password = '1234';

        $client = new Client([
            'base_uri' => 'https://ked.priority-software.com.cy/',
            //'base_uri' => 'https://webhook.site/    ',
            'headers' => [
                'Authorization' => 'Basic ' . base64_encode("$username:$password"),
            ],
            'verify' => false
        ]);
        $response = $client->post('/odata/Priority/tabula.ini/efk/B2B_ORDERS', [
            //$response = $client->post('/8f26953c-abf6-4290-8515-65a906f7df75', [
            'json' => $order,
        ]);

        $body = (string) $response->getBody();
        $data = json_decode($body, true);
        return $body;
        // try {
        //     return $response->withStatus(200)->withJson($data);
        // } catch (\Throwable $th) {
        //     return $response->withStatus(200)->withJson($th);
        // }
    }
});

$app->get('/vendors', function (Request $request, Response $response, array $args) {

    $username = 'apiuser';
    $password = '1234';

    $client = new Client([
        //'base_uri' => 'https://ked.priority-software.com.cy/',
        'base_uri' => 'https://ked.priority-software.com.cy/',
        'headers' => [
            'Authorization' => 'Basic ' . base64_encode("$username:$password"),
        ],
        'verify' => false
    ]);

    $response = $client->get('/odata/Priority/tabula.ini/efk/B2B_SUPPLIERS?$filter=STATDES eq \'Active\'', []);

    $body = (string) $response->getBody();
    $data = json_decode($body, true);

    return $response;
});


$app->get('/invoices', function (Request $request, Response $response, array $args) {
    $date = date('Y-m-d',strtotime(date("Y-m-d", strtotime("-30 day"))));

    $username = 'apiuser';
    $password = '1234';

    $client = new Client([
        //'base_uri' => 'https://ked.priority-software.com.cy/',
        'base_uri' => 'https://ked.priority-software.com.cy/',
        'headers' => [
            'Authorization' => 'Basic ' . base64_encode("$username:$password"),
        ],
        'verify' => false
    ]);

    $response = $client->get('/odata/Priority/tabula.ini/efk/AINVOICES?$filter=CUSTNAME eq \'C1001\' and STATDES eq \'Final\' and IVDATE ge ' .$date, []);

    $body = (string) $response->getBody();
    // return $data;

    return $response;
});

$app->get('/invoice-pdf', function (Request $request, Response $response, array $args) {
    $invoiceId = $request->getQueryParams('invoice_id')['invoice_id'];
    $username = 'apiuser';
    $password = '1234';
    $client = new Client([
        //'base_uri' => 'https://ked.priority-software.com.cy/',
        'base_uri' => 'https://ked.priority-software.com.cy/',
        'headers' => [
            'Authorization' => 'Basic ' . base64_encode("$username:$password"),
        ],
        'json' => ['IVNUM' => $invoiceId],
        'verify' => false
    ]);


    $response = $client->post('odata/Priority/tabula.ini/efk/DEXT_APINVOS');

    $body = (string) $response->getBody();

    return $body;
});


$app->get('/statements', function (Request $request, Response $response, array $args) {

    $username = 'apiuser';
    $password = '1234';
    $client = new Client([
        //'base_uri' => 'https://ked.priority-software.com.cy/',
        'base_uri' => 'https://ked.priority-software.com.cy/',
        'headers' => [
            'Authorization' => 'Basic ' . base64_encode("$username:$password"),
        ],
        'verify' => false
    ]);
    //2022-05-17    
    $todayDate = date("Y-m-d");
    $lastYearDate = date("Y-m-d", strtotime("-1 year"));
    $sub_url = '/odata/Priority/tabula.ini/efk/DEXT_CUSTSTMT?$filter=FROMDATE ge ' . $lastYearDate . ' and TODATE le ' . $todayDate . ' and CUSTNAME eq \'C1001\'';
    // print_r($sub_url);die;
    $response = $client->get($sub_url);

    return $response;
});

$app->get('/backorders', function (Request $request, Response $response, array $args) {
    $date = date('Y-m-d',strtotime(date("Y-m-d", strtotime("-5 day"))));

    $username = 'apiuser';
    $password = '1234';
    $client = new Client([
        //'base_uri' => 'https://ked.priority-software.com.cy/',
        'base_uri' => 'https://ked.priority-software.com.cy/',
        'headers' => [
            'Authorization' => 'Basic ' . base64_encode("$username:$password"),
        ],
        'verify' => false
    ]);

    $sub_url = '/odata/Priority/tabula.ini/efk/B2B_BACKORDERS?$filter=CUSTNAME eq \'C1001\' and DEXT_SUBMISSIONDATE ge ' .$date;
    // print_r($sub_url);die;
    $response = $client->get($sub_url);

    return $response;
});

$app->get('/backorder-products', function (Request $request, Response $response, array $args) {
    $order_id = $request->getQueryParams('order_id')['order_id'];
    $username = 'apiuser';
    $password = '1234';
    $client = new Client([
        //'base_uri' => 'https://ked.priority-software.com.cy/',
        'base_uri' => 'https://ked.priority-software.com.cy/',
        'headers' => [
            'Authorization' => 'Basic ' . base64_encode("$username:$password"),
        ],
        'verify' => false
    ]);
    $sub_url = '/odata/Priority/tabula.ini/efk/B2B_ORDERS(ORDNAME=\'' . $order_id . '\')?$expand=B2B_ORDERITEMS_SUBFORM';
    // print_r($sub_url);die;
    $response = $client->get($sub_url);

    return $response;
});

$app->get('/return-policy', function (Request $request, Response $response, array $args) {
    $order_id = $request->getQueryParams('barcode')['barcode'];
    $username = 'apiuser';
    $password = '1234';
    $client = new Client([
        //'base_uri' => 'https://ked.priority-software.com.cy/',
        'base_uri' => 'https://ked.priority-software.com.cy/',
        'headers' => [
            'Authorization' => 'Basic ' . base64_encode("$username:$password"),
        ],
        'verify' => false
    ]);
    $sub_url = 'odata/Priority/tabula.ini/efk/B2B_LOGPART?$filter=BARCODE eq \'' . $order_id . '\'';
    // print_r($sub_url);die;
    $response = $client->get($sub_url);

    return $response;
});

$app->get('/fetch-orders', function (Request $request, Response $response, array $args) {
    $date = date('Y-m-d',strtotime(date("Y-m-d", strtotime("-5 day"))));
    $customer_id = $request->getQueryParams('customer_id')['customer_id'];
    $username = 'apiuser';
    $password = '1234';
    $client = new Client([
        //'base_uri' => 'https://ked.priority-software.com.cy/',
        'base_uri' => 'https://ked.priority-software.com.cy/',
        'headers' => [
            'Authorization' => 'Basic ' . base64_encode("$username:$password"),
        ],
        'verify' => false
    ]);
    $sub_url = 'odata/Priority/tabula.ini/efk/B2B_ORDERS?$filter=CUSTNAME eq \'' . $customer_id . '\' and DEXT_SUBMISSIONDATE ge ' .$date ;
    // print_r($sub_url);die;
    $response = $client->get($sub_url);

    return $response;
});

$app->get('/discount/', function (Request $request, Response $response, array $args) {

    $sql = "SELECT * FROM discount";

    try {
        // Get DB Object
        $db = new db();
        // Connect
        $db = $db->connect();

        $stmt = $db->prepare($sql);
        $stmt->execute();
        $discounts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $response->withStatus(200)->withJson($discounts);
    } catch (PDOException $e) {
        echo '{"error": {"text": ' . $e->getMessage() . '}';
    }
});

$app->get('/pharmacies', function (Request $request, Response $response, array $args) {

    $username = 'apiuser';
    $password = '1234';
    $client = new Client([
        //'base_uri' => 'https://ked.priority-software.com.cy/',
        'base_uri' => 'https://ked.priority-software.com.cy/',
        'headers' => [
            'Authorization' => 'Basic ' . base64_encode("$username:$password"),
        ],
        'verify' => false
    ]);
    $sub_url = 'odata/Priority/tabula.ini/efk/B2B_PHCUSTONE?$filter=ACTIVEFLAG eq \'Y\'' ;
    // print_r($sub_url);die;
    $response = $client->get($sub_url);
    // echo count($response['value']);die;
    return $response;
});

$app->run();
