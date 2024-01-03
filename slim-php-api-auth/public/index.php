<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \Firebase\JWT\JWT;
use GuzzleHttp\Client;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;


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

// require '../src/middleware.php';
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

    //for testing
    // $username = 'api2';
    // $password = 'api2';

    // $client = new Client([
    //     'base_uri' => 'https://priority.kedifap.local/',
    //     // 'base_uri' => 'https://randomfox.ca/',
    //     'headers' => [
    //         'Authorization' => 'Basic ' . base64_encode("$username:$password"),
    //     ],
    //     'verify' => false
    // ]);
    // //priorityappsrv.kedifap.local
    // //https://randomfox.ca/floof/
    // $response = $client->get('/odata/Priority/tabula.ini/efk/B2B_SUPPLIERS', []);
    // // $response = $client->get('/floof', []);

    // return $response;
    return $response->withHeader('Location', 'https://app.portal.kedifap.com/');
});

// Authenticate
$app->post('/authenticate', function (Request $request, Response $response) {
    session_start();
    // $dotenv_file = dirname(__DIR__, 1) . '..\.env';
    $dotenv_file = dirname(__DIR__, 1) . '/.env';
    $dotenv_contents = file_get_contents($dotenv_file);
    $dotenv_vars = parse_ini_string($dotenv_contents);

    //$name = $request->getParam('name');
    $params = $request->getParsedBody();
    $name = $params['username'] ?? '';
    $pass = $params['password'] ?? '';

    $sql = "SELECT * FROM customers WHERE DEXT_USERLOGIN = :user_id";
    try {
        // Get DB Object
        $db = new db();
        // Connect
        $db = $db->connect();

        $stmt = $db->prepare($sql);
        $stmt->bindParam(':user_id', $name, PDO::PARAM_STR);
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $data["success"] = false;
        $data["token"] = null;
        $status = 404;
        $salt = 'JFLEw7skC$&hAxk4';
        $hashed_login_attempt = crypt($pass, $salt);

        foreach ($users as $user) {

            if ($user['DEXT_USERLOGIN'] === $name && $user['DEXT_PASSWORD'] === $hashed_login_attempt) {

                $roleCheck = substr($name, 0, 1);
                $userRole = 'customer';
                $roleCheck == 'V' ? $userRole = 'vendor' : $userRole = 'customer';
                $MyJWT = $this->JWT;
                //return print_r($MyJWT);
                $now = new DateTime();
                $future = new DateTime("now +24 hours");
                $server = $request->getParams();
                $payload = [
                    "iat" => $now->getTimeStamp(),
                    "exp" => $future->getTimeStamp(),
                    "sub" => $server,
                    "role" => $userRole
                ];

                $secret = $dotenv_vars['SECRET'];

                $token = $MyJWT->encode($payload, $secret, "HS512");

                $sqlTokenCheck = "SELECT * FROM usr_token WHERE user_id = :user_id";
                $token_stmt = $db->prepare($sqlTokenCheck);
                $token_stmt->bindParam(':user_id', $name, PDO::PARAM_STR);
                $token_stmt->execute();
                $userToken = $token_stmt->fetchAll(PDO::FETCH_ASSOC);
                // return $userToken;
                if (empty($userToken)) {
                    $sqlTokenInsertQuery = "INSERT INTO usr_token (user_id, token, created_at)
                    VALUES (:user_id, :token, NOW())";
                    $stmt = $db->prepare($sqlTokenInsertQuery);
                    $stmt->bindParam(':user_id', $name, PDO::PARAM_STR);
                    $stmt->bindParam(':token', $token, PDO::PARAM_STR);
                    $stmt->execute();

                    // Check if the query was successful
                    if ($stmt->rowCount() > 0) {
                        $data["success"] = true;
                        $data["token"] = $token;
                        $data["user"] = $user;
                    } else {
                        $data["success"] = false;
                        $data["token"] = null;
                        $data["user"] = $user;
                    }
                } else { //if token exist
                    $sql = "DELETE FROM usr_token WHERE user_id = :user_id";
                    $stmt = $db->prepare($sql);
                    $stmt->bindParam(':user_id', $name, PDO::PARAM_STR);
                    $stmt->execute();
                    if ($stmt->rowCount() > 0) {
                        $sqlTokenInsertQuery = "INSERT INTO usr_token (user_id, token, created_at)
                    VALUES (:user_id, :token, NOW())";
                        $stmt = $db->prepare($sqlTokenInsertQuery);
                        $stmt->bindParam(':user_id', $name, PDO::PARAM_STR);
                        $stmt->bindParam(':token', $token, PDO::PARAM_STR);
                        $stmt->execute();
                        if ($stmt->rowCount() > 0) {
                            $data["success"] = true;
                            $data["token"] = $token;
                            $data["user"] = $user;
                        } else {
                            $data["success"] = false;
                            $data["token"] = null;
                            $data["user"] = $user;
                        }
                    } else {
                        $data["success"] = false;
                        $data["token"] = null;
                        $data["user"] = $user;
                    }
                }


                $status = 200;
                //->withStatus(302)->withHeader('Location', 'https://kedi-app.com2go.co');
                //return $response->withStatus(302)->withHeader('Location', 'http://localhost:3000/');
                //return $response->withStatus(302)->withHeader('Location', 'https://kedi-app.com2go.co');
            }
        }
        return $response->withStatus($status)->withHeader("Content-Type", "application/json")
            ->write(json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT))
            ->withHeader('Access-Control-Allow-Origin', 'https://app.portal.kedifap.com');
    } catch (PDOException $e) {
        echo '{"error": {"text": ' . $e->getMessage() . '}';
    }
});

$app->get('/validate-token', function (Request $request, Response $response, array $args) {
    // $data = array('message' => 'Hello from the backend!');
    // return $response->withJson($data);
    $file = '../log.txt'; // path to file
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


    $content = 'This is example text.'; // content to write

    if (!$token) {
        //return $response->withStatus(202)->withJson(['error' => 'Unauthorized']);
        return $response->withStatus(200)->withJson(['isTokenValid' => false]);
    }

    try {
        $decoded = JWT::decode($token, $dotenv_vars['SECRET'], array('HS512'));
        $data_string = serialize($decoded);
        //file_put_contents($file, gettype($decoded) , FILE_APPEND);

        //print_r($decoded);
        //die;
        //return $response->withStatus(200)->withJson(['message' => 'Token is valid']);
        return $response->withStatus(200)->withJson(['isTokenValid' => true]);
    } catch (\Throwable $th) {

        return $response->withStatus(401)->withJson(['error' => 'Unauthorized']);
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
    $quotaFilter = '';

    if (isset($request->getQueryParams('isVendor')['isVendor']))
        $isVendor = $request->getQueryParams('isVendor')['isVendor'];

    if (isset($request->getQueryParams('discountFilter')['discountFilter']))
        $discountedFilter = $request->getQueryParams('discountFilter')['discountFilter'];

    if (isset($request->getQueryParams('quotaFilter')['quotaFilter']))
        $quotaFilter = $request->getQueryParams('quotaFilter')['quotaFilter'];

    $globalFilter = $request->getQueryParams('globalFilter')['globalFilter'];
    $page *= 100;
    $dotenv_file = dirname(__DIR__, 1) . '..\.env';
    $dotenv_contents = file_get_contents($dotenv_file);
    $dotenv_vars = parse_ini_string($dotenv_contents);

    $sortingQuery = '';
    $filterQuery = '';
    $customFilterQuery = '';
    $quotaFilterQuery = '';
    $isVendorQuery = '';
    $globalFilterDiscount = '';
    $and = '';
    $where = '';
    $where2 = '';
    $vendorSubQuery = '';

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
        // print_r($columnId);die;
    }
    if (!empty(json_decode($customColumnFilter)) && !empty($customColumnFilter)) {
        $customColumnFilterArray = json_decode($customColumnFilter);
        $columnId = $customColumnFilterArray[0]->id;
        $custonFilterValue = $customColumnFilterArray[0]->value;
        // var_dump($custonFilterValue);die;
        $and = ' AND ';
        $where = ' WHERE ';
        if ($columnId == 'vendors.SUPDES') {
            $vendorSubQuery = ' INNER JOIN vendors on vendors.SUPNAME = parts.DEXT_IMPORTERNAME WHERE vendors.SUPDES LIKE :customFilterValue';
            $where = ' ';
        } else
            $customFilterQuery = " $columnId LIKE :customFilterValue";
    }

    if (!empty(json_decode($isVendor)) && !empty($isVendor)) {
        $isVendorArray = json_decode($isVendor);
        $isVendorValue = $isVendorArray[0]->value;
        // print_r($isVendorValue) ; die;
        $where = ' WHERE ';
        $isVendorQuery = "parts.SUPNAME LIKE :isVendor";
    }

    $and2 = '';
    $and3 = '';
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
    if ($filterQuery !== '' && $vendorSubQuery !== '') {
        $where = ' AND ';
    }

    if (!empty(json_decode($quotaFilter)) && !empty($quotaFilter)) {
        if ($isVendorQuery == '' && $customFilterQuery == '' && $filterQuery == '') {
            $where2 = ' WHERE ';
            $and3 = '';
        } else {
            $where2 = '';
            $and3 = ' AND ';
        }
        if ($vendorSubQuery !== '' && $filterQuery == '')
            $where2 = ' AND ';
        $quotaFilterQuery = ' DEXT_LOWSTOCKQTY > 0 ';
    }
    if ($isVendorQuery !== '' && $quotaFilterQuery !== '') {
        if ($vendorSubQuery !== '')
            $where = ' AND ';
        else $where = ' WHERE ';
        $where2 = '';
    }
    if ($isVendorQuery !== '' && $quotaFilterQuery == '' && $vendorSubQuery !== '')
        $where = ' AND ';

    // $and = '' ? $filterQuery == '' :
    $sql = "SELECT * FROM parts $vendorSubQuery $where $filterQuery $and $customFilterQuery $and2 $isVendorQuery $where2 $and3 $quotaFilterQuery $sortingQuery LIMIT :size OFFSET :page";
    $totalRowsQuery = "SELECT COUNT(PARTNAME) FROM parts $vendorSubQuery $where $filterQuery $and $customFilterQuery $and2 $isVendorQuery $where2 $and3 $quotaFilterQuery";

    // echo $sql;
    // die;

    if (!empty(json_decode($discountedFilter)) && !empty($discountedFilter)) {
        $and2 = '';
        if ($customFilterQuery !== '') $and2 = ' AND ';

        $sql = "SELECT * FROM parts INNER JOIN discount ON parts.PARTNAME = discount.DEXT_OFFERPARTNAME $vendorSubQuery $where $filterQuery $and $customFilterQuery $and2 $isVendorQuery $where2 $and3 $quotaFilterQuery $sortingQuery LIMIT :size OFFSET :page";

        $globalFilterDiscount = " INNER JOIN discount ON parts.PARTNAME = discount.DEXT_OFFERPARTNAME ";

        $totalRowsQuery = "SELECT COUNT(DISTINCT PARTNAME) FROM parts INNER JOIN discount ON parts.PARTNAME = discount.DEXT_OFFERPARTNAME $vendorSubQuery $where $filterQuery $and $customFilterQuery $and2 $isVendorQuery $where2 $and3 $quotaFilterQuery";
    }

    //global search
    if ($globalFilter !== '' && $globalFilter !== null) {
        if ($isVendorQuery !== '') $and = ' AND ';
        else $and = '';
        if ($filterQuery !== '') $and2 = ' AND ';
        else $and2 = '';
        $and3 = '';
        if ($quotaFilterQuery !== '') $and3 = ' AND ';

        $sql = "SELECT * FROM parts $globalFilterDiscount WHERE PARTNAME OR PARTDES OR BARCODE LIKE :globalFilter $and $isVendorQuery $and2 $filterQuery $and3 $quotaFilterQuery $sortingQuery";

        $totalRowsQuery = "SELECT COUNT(PARTNAME) FROM parts $globalFilterDiscount WHERE PARTNAME OR PARTDES LIKE :globalFilter $and $isVendorQuery $and2 $filterQuery $and3 $quotaFilterQuery";
        // var_dump($isVendorQuery);die;
    }

    try {
        // var_dump($sql);die;
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
            if (isset($filterValue)) {
                $stmt->bindValue(':filterValue', '%' . $filterValue . '%', PDO::PARAM_STR);
                $countStmt->bindValue(':filterValue', '%' . $filterValue . '%', PDO::PARAM_STR);
            }
        } else {
            $stmt->bindValue(':size', $size, PDO::PARAM_INT);
            $stmt->bindValue(':page', $page, PDO::PARAM_INT);
            // print_r($size);die;
        }
        // print_r($globalFilter);die;
        // $stmt->debugDumpParams();
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
        //https://priority.kedifap.local/odata/Priority/tabula.ini/efk/B2B_ORDERS
        $order = $request->getParsedBody();
        // print_r($order);die;
        $username = 'api2';
        $password = 'api2';

        $client = new Client([
            'base_uri' => 'https://priority.kedifap.local/',
            // 'base_uri' => 'https://webhook.site/',
            'headers' => [
                'Authorization' => 'Basic ' . base64_encode("$username:$password"),
            ],
            'verify' => false
        ]);
        $file = './log.txt';
        file_put_contents($file, $order, FILE_APPEND);

        $response = $client->post('/odata/Priority/tabula.ini/efk/B2B_ORDERS', [
            'json' => $order,
        ]);
        // $response = $client->post('/9f333cdc-3432-45d5-a791-1f4e11d83370', [
        //     'json' => $order,
        // ]);
        $body = (string) $response->getBody();

        // $data = json_decode($body, true);
        return $body;
        // try {
        //     return $response->withStatus(200)->withJson($data);
        // } catch (\Throwable $th) {
        //     return $response->withStatus(200)->withJson($th);
        // }
    }
});

$app->get('/vendors', function (Request $request, Response $response, array $args) {

    $filterQuery = '';
    $sortingQuery = '';
    $sortingQuery = 'ORDER BY SUPDES ASC';
    $columnFilter = isset($request->getQueryParams('filters')['filters']) ? $request->getQueryParams('filters')['filters'] : '';
    $columnSort = isset($request->getQueryParams('sorting')['sorting']) ? $request->getQueryParams('sorting')['sorting'] : '';

    if (!empty(json_decode($columnSort))) {
        $sortingArray = json_decode($columnSort);
        $columnId = $sortingArray[0]->id;
        $sortDirection = $sortingArray[0]->desc;
        $sortDirection = !empty($sortDirection) ? 'DESC' : 'ASC';
        $sortingQuery = "ORDER BY $columnId $sortDirection";
    }
    // return $columnId;
    if (!empty(json_decode($columnFilter)) && !empty($columnFilter)) {
        $columnFilterArray = json_decode($columnFilter);
        $columnId = $columnFilterArray[0]->id;
        $filterValue = $columnFilterArray[0]->value;
        $filterQuery = "WHERE $columnId LIKE :filterValue";
        // print_r($columnId);die;
    }

    $sql = "SELECT * FROM `vendors` $filterQuery $sortingQuery";

    $totalRowsQuery = "SELECT COUNT(SUPDES) FROM vendors  $filterQuery";
    // return $sql;
    try {

        // Get DB Object
        $db = new db();
        $db = $db->connect();

        $stmt = $db->prepare($sql);
        $countStmt = $db->prepare($totalRowsQuery);

        if (!empty(json_decode($columnFilter)) && !empty($columnFilter)) {
            $stmt->bindValue(':filterValue', '%' . $filterValue . '%', PDO::PARAM_STR);
            $countStmt->bindValue(':filterValue', '%' . $filterValue . '%', PDO::PARAM_STR);
        }
        // $stmt->debugDumpParams();
        // die;
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        // print_r($result );die;
        return $response->withStatus(200)->withJson($result);
    } catch (PDOException $e) {
        echo '{"error": {"text": ' . $e->getMessage() . '}';
    }
});


$app->get('/invoices', function (Request $request, Response $response, array $args) {

    $customer_id = $request->getQueryParams('customer_id')['customer_id'];
    list($customer_main_id, $customer_login_id) = explode('-', $customer_id);


    $monthFilter = isset($request->getQueryParams('monthFilter')['monthFilter']) ? $request->getQueryParams('monthFilter')['monthFilter'] : '';

    $selectedDate = date('Y-m-d', strtotime(date("Y-m-d", strtotime("-5 day"))));
    if (!empty(json_decode($monthFilter)) && !empty($monthFilter)) {
        $monthFilterArray = json_decode($monthFilter);
        $filterValue = $monthFilterArray[0]->value;
        switch ($filterValue) {
            case 'currentMonth':
                $selectedDate = date("Y-m-01");
                break;
            case 'lastMonth':
                $selectedDate = date("Y-m-01", strtotime("last month"));
                break;
            case 'last4Months':
                $selectedDate = date("Y-m-01", strtotime("-4 months"));
                break;

            default:
                # code...
                break;
        }
        // print_r($columnId);die;
    }


    $columnFilter = $request->getQueryParams('filters')['filters'];
    $filterQuery = '';
    $ge = 'ge ';
    if (!empty(json_decode($columnFilter)) && !empty($columnFilter)) {
        $columnFilterArray = json_decode($columnFilter);
        $columnId = $columnFilterArray[0]->id;
        $filterValue = $columnFilterArray[0]->value;

        // if ($columnId == 'IVDATE') {
        //     $ge = 'eq ';
        //     $date = date("Y-m-d", strtotime($filterValue));
        //     $filterQuery = '';
        // } else
        //     $filterQuery = " and $columnId eq '$filterValue'";
        if ($columnId !== 'IVDATE') {
            $filterQuery = " and $columnId eq '$filterValue'";
        }
    }
    $username = 'api2';
    $password = 'api2';

    $url = 'https://dl.portal.kedifap.com/';
    try {
        $client = new Client([
            // 'base_uri' => 'https://priority.kedifap.local/',
            'base_uri' => $url,
            'headers' => [
                'Authorization' => 'Basic ' . base64_encode("$username:$password"),
            ],
            'verify' => false
        ]);

        $sub_url = '/odata/Priority/tabula.ini/efk/AINVOICES?$filter=CUSTNAME eq ' . '\'' . $customer_main_id . '\'' . ' and DCODE eq \'' . $customer_login_id . '\'   and IVDATE ' . $ge  . $selectedDate  . $filterQuery;
        // return $sub_url;

        $response = $client->get($sub_url);

        // $body = (string) $response->getBody();
        // return $data;

        return $response;
    } catch (\Throwable $th) {
        return $response->withStatus(401)->withJson(['error' => $th]);
    }
});


$app->get('/invoices-c', function (Request $request, Response $response, array $args) {
    $customer_id = $request->getQueryParams('customer_id')['customer_id'];
    list($customer_main_id, $customer_login_id) = explode('-', $customer_id);

    $monthFilter = isset($request->getQueryParams('monthFilter')['monthFilter']) ? $request->getQueryParams('monthFilter')['monthFilter'] : '';

    $selectedDate = date('Y-m-d', strtotime(date("Y-m-d", strtotime("-5 day"))));
    if (!empty(json_decode($monthFilter)) && !empty($monthFilter)) {
        $monthFilterArray = json_decode($monthFilter);
        $filterValue = $monthFilterArray[0]->value;
        switch ($filterValue) {
            case 'currentMonth':
                $selectedDate = date("Y-m-01");
                break;
            case 'lastMonth':
                $selectedDate = date("Y-m-01", strtotime("last month"));
                break;
            case 'last4Months':
                $selectedDate = date("Y-m-01", strtotime("-4 months"));
                break;

            default:
                # code...
                break;
        }
        // print_r($columnId);die;
    }


    $columnFilter = $request->getQueryParams('filters')['filters'];
    $filterQuery = '';
    $ge = 'ge ';
    if (!empty(json_decode($columnFilter)) && !empty($columnFilter)) {
        $columnFilterArray = json_decode($columnFilter);
        $columnId = $columnFilterArray[0]->id;
        $filterValue = $columnFilterArray[0]->value;

        // if ($columnId == 'IVDATE') {
        //     $ge = 'eq ';
        //     $date = date("Y-m-d", strtotime($filterValue));
        //     $filterQuery = '';
        // } else
        //     $filterQuery = " and $columnId eq '$filterValue'";
        if ($columnId !== 'IVDATE') {
            $filterQuery = " and $columnId eq '$filterValue'";
        }
    }
    $username = 'api2';
    $password = 'api2';

    $url = 'https://dl.portal.kedifap.com/';
    try {
        $client = new Client([
            // 'base_uri' => 'https://priority.kedifap.local/',
            'base_uri' => $url,
            'headers' => [
                'Authorization' => 'Basic ' . base64_encode("$username:$password"),
            ],
            'verify' => false
        ]);

        $sub_url = '/odata/Priority/tabula.ini/efk/CINVOICES?$filter=CUSTNAME eq ' . '\'' . $customer_main_id . '\'' . 'and DCODE eq \'' . $customer_login_id . '\'  and IVDATE ' . $ge  . $selectedDate  . $filterQuery;
        // return $sub_url;

        $response = $client->get($sub_url);

        // $body = (string) $response->getBody();
        // return $data;

        return $response;
    } catch (\Throwable $th) {
        return $response->withStatus(401)->withJson(['error' => $th]);
    }
});

$app->get('/invoice-pdf', function (Request $request, Response $response, array $args) {
    $invoiceId = $request->getQueryParams('invoice_id')['invoice_id'];
    $username = 'api2';
    $password = 'api2';
    $client = new Client([
        'base_uri' => 'https://priority.kedifap.local/',
        'headers' => [
            'Authorization' => 'Basic ' . base64_encode("$username:$password"),
        ],
        'json' => ['IVNUM' => $invoiceId],
        'verify' => false
    ]);

    substr($invoiceId, 0, 1) == 'C' ? $response = $client->post('odata/Priority/tabula.ini/efk/DEXT_APIMEMOS') : $response = $client->post('odata/Priority/tabula.ini/efk/DEXT_APINVOS');

    $body = (string) $response->getBody();

    return $body;
});


$app->get('/statements', function (Request $request, Response $response, array $args) {
    $customer_id = $request->getQueryParams('customer_id')['customer_id'];
    list($customer_main_id, $customer_login_id) = explode('-', $customer_id);

    $columnFilter = $request->getQueryParams('filters')['filters'];

    $filterQuery = '';
    if (!empty(json_decode($columnFilter)) && !empty($columnFilter)) {
        $columnFilterArray = json_decode($columnFilter);
        $columnId = $columnFilterArray[0]->id;
        $filterValue = $columnFilterArray[0]->value;
        $filterQuery = " and $columnId eq $filterValue";
        $ge = 'ge ';
        if ($columnId == 'DEXT_SUBMISSIONDATE') {
            $date = date("Y-m-d", strtotime($filterValue));
            $filterQuery = '';
        }
    }

    $username = 'api2';
    $password = 'api2';
    $todayDate = date("Y-m-d");
    // $lastYearDate = '2023-08-01';
    $lastYearDate = date("Y-m-d", strtotime("-1 year"));

    // $sub_url = '/odata/Priority/tabula.ini/efk/DEXT_CUSTSTMT?$filter=FROMDATE ge ' . $lastYearDate . ' and TODATE le ' . $todayDate . ' and CUSTNAME eq ' . '\'' . $customer_id . '\'' . $filterQuery;
    //$sub_url = '/odata/Priority/tabula.ini/efk/DEXT_CUSTSTMT?$filter=TODATE%20ge%20' . $lastYearDate . 'T00:00:00%2B02:00%20%20and%20CUSTNAME%20eq%20%27' . $customer_id . '%27' . $filterQuery;
    $sub_url = '/odata/Priority/tabula.ini/efk/DEXT_CUSTSTMT?$filter=TODATE ge 2023-10-01T00:00:00%2B02:00%20%20and CUSTNAME eq ' . '\'' . $customer_main_id . '\' ' . $filterQuery;
    // return $sub_url;
    $url = 'https://dl.portal.kedifap.com/';

    $client = new Client([
        // 'base_uri' => $url,
        'base_uri' => 'https://priority.kedifap.local/',
        'headers' => [
            'Authorization' => 'Basic ' . base64_encode("$username:$password"),
        ],
        'verify' => false
    ]);
    // return $sub_url;

    try {
        $response = $client->get($sub_url);

        return $response;
    } catch (\Throwable $th) {
        return $response->withStatus(401)->withJson(['error' => $th]);
    }
});

$app->get('/backorders', function (Request $request, Response $response, array $args) {

    $customer_id = $request->getQueryParams('customer_id')['customer_id'];
    $columnFilter = $request->getQueryParams('filters')['filters'];
    $columnSort = isset($request->getQueryParams('sorting')['sorting']) ? $request->getQueryParams('sorting')['sorting'] : '';
    $filterQuery = '';
    $sortingQuery = '';

    if (!empty(json_decode($columnFilter)) && !empty($columnFilter)) {
        $columnFilterArray = json_decode($columnFilter);
        $columnId = $columnFilterArray[0]->id;
        $filterValue = $columnFilterArray[0]->value;
        $where = ' WHERE ';
        $filterQuery = " and $columnId LIKE :filterValue";
        $and = ' AND ';
        // print_r($columnId);die;
    }
    if (!empty(json_decode($columnSort))) {
        $sortingArray = json_decode($columnSort);
        $columnId = $sortingArray[0]->id;
        $sortDirection = $sortingArray[0]->desc;
        $sortDirection = !empty($sortDirection) ? 'DESC' : 'ASC';
        $sortingQuery = "ORDER BY $columnId $sortDirection";
    }

    $date = date('Y-m-d', strtotime(date("Y-m-d", strtotime("-5 day"))));

    $sql = "SELECT * FROM backorders WHERE CUSTNAME = :custId AND DEXT_SUBMISSIONDATE > $date $filterQuery $sortingQuery";
    // return $sql;
    try {
        // Get DB Object
        $db = new db();
        // Connect
        $db = $db->connect();
        $stmt = $db->prepare($sql);
        $stmt->bindValue(':custId', $customer_id, PDO::PARAM_STR);
        if (!empty(json_decode($columnFilter)) && !empty($columnFilter)) {
            $stmt->bindValue(':filterValue', '%' . $filterValue . '%', PDO::PARAM_STR);
        }
        $stmt->execute();
        $backOrder = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $response->withStatus(200)->withJson($backOrder);
    } catch (PDOException $e) {
        echo '{"error": {"text": ' . $e->getMessage() . '}';
    }
});

$app->get('/backorder-products', function (Request $request, Response $response, array $args) {
    $order_id = $request->getQueryParams('order_id')['order_id'];
    $username = 'api2';
    $password = 'api2';
    $url = 'https://dl.portal.kedifap.com/';
    $client = new Client([
        'base_uri' => 'https://priority.kedifap.local/',
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
    if (isset($request->getQueryParams('barcode')['barcode']))
        $order_id = $request->getQueryParams('barcode')['barcode'];

    if (isset($request->getQueryParams('kdcode')['kdcode']))
        $kdcode_id = $request->getQueryParams('kdcode')['kdcode'];

    $username = 'api2';
    $password = 'api2';
    $url = 'https://dl.portal.kedifap.com/';
    $client = new Client([
        'base_uri' => 'https://priority.kedifap.local/',
        // 'base_uri' => $url,
        'headers' => [
            'Authorization' => 'Basic ' . base64_encode("$username:$password"),
        ],
        'verify' => false
    ]);
    if (isset($order_id) && $order_id)
        $sub_url = 'odata/Priority/tabula.ini/efk/B2B_LOGPART?$filter=BARCODE eq \'' . $order_id . '\'';
    else $sub_url = 'odata/Priority/tabula.ini/efk/B2B_LOGPART?$filter=DEXT_PARTBARCODE eq \'' . $kdcode_id . '\'';
    // return($sub_url);die;
    $response = $client->get($sub_url);

    return $response;
});

$app->get('/fetch-orders', function (Request $request, Response $response, array $args) {
    $date = date('Y-m-d', strtotime(date("Y-m-d", strtotime("-5 day"))));
    $customer_login_id = '';
    $customer_id = $request->getQueryParams('customer_id')['customer_id'];
    if (str_contains($customer_id, '-'))
        list($customer_main_id, $customer_login_id) = explode('-', $customer_id);
    else $customer_main_id = $customer_id;

    $columnFilter = $request->getQueryParams('filters')['filters'];
    // $sorting = $request->getQueryParams('sorting')['sorting'];
    // return $sorting;
    $filterQuery = '';
    $ge = 'ge ';
    $ls = '';
    $nextDay = '';

    if (!empty(json_decode($columnFilter)) && !empty($columnFilter)) {
        $columnFilterArray = json_decode($columnFilter);
        $columnId = $columnFilterArray[0]->id;
        $filterValue = $columnFilterArray[0]->value;
        $filterQuery = " and $columnId eq '$filterValue'";
        if ($columnId == 'DEXT_SUBMISSIONDATE') {
            // $ge = 'eq ';
            $ls = ' and DEXT_SUBMISSIONDATE le ';
            $date = date("Y-m-d", strtotime($filterValue));
            $nextDay = date('Y-m-d', strtotime("+1 day", strtotime($filterValue)));
            // return $nextDay;
            $filterQuery = '';
        }
    }


    $customer_id[0] == 'V' ? $userCol = 'DEXT_SUPPNAME' : $userCol = 'CUSTNAME';


    $username = 'api2';
    $password = 'api2';
    $url = 'https://dl.portal.kedifap.com/';
    try {
        $client = new Client([
            // 'base_uri' => 'https://priority.kedifap.local/',
            'base_uri' => $url,
            'headers' => [
                'Authorization' => 'Basic ' . base64_encode("$username:$password"),
            ],
            'verify' => false
        ]);
        $sub_url = 'odata/Priority/tabula.ini/efk/B2B_ORDERS?$filter=' . $userCol . ' eq \'' . $customer_main_id . '\' and DCODE eq \'' . $customer_login_id . '\' and DEXT_SUBMISSIONDATE ' . $ge . $date . $ls . $nextDay . $filterQuery;        // return($sub_url);die;
        $response = $client->get($sub_url);

        return $response;
    } catch (\Throwable $th) {
        return $response->withStatus(404)->withJson($th);
    }
    // return $columnFilter;

});

$app->get('/discount', function (Request $request, Response $response, array $args) {

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

    $sql = "SELECT * FROM customers WHERE CUSTNAME LIKE 'C%'";

    try {
        // Get DB Object
        $db = new db();
        // Connect
        $db = $db->connect();

        $stmt = $db->prepare($sql);
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $response->withStatus(200)->withJson($users);
    } catch (PDOException $e) {
        echo '{"error": {"text": ' . $e->getMessage() . '}';
    }
    // print_r($response);die;
});

// $app->get('/pharmacies', function (Request $request, Response $response, array $args) {

//     $username = 'api2';
//     $password = 'api2';
//     $client = new Client([
//         'base_uri' => 'https://priority.kedifap.local/',
//         'headers' => [
//             'Authorization' => 'Basic ' . base64_encode("$username:$password"),
//         ],
//         'verify' => false
//     ]);
//     // $sub_url = 'odata/Priority/tabula.ini/efk/B2B_PHCUSTONE?$filter=ACTIVEFLAG eq \'Y\'';
//     $sub_url = 'odata/Priority/tabula.ini/efk/B2B_PHONEBOOK';
//     // print_r($sub_url);die;
//     $response = $client->get($sub_url);
//     // echo count($response['value']);die;
//     return $response;
// });

$app->get('/fetch-offer', function (Request $request, Response $response, array $args) {
    $offer_id = $request->getQueryParams('offer_id')['offer_id'];
    // echo $offer_id;die;
    $sql = "SELECT parts.PARTNAME, parts.PARTDES, parts.SUPNAME, parts.DEXT_IMPORTERNAME, parts.VATPRICE, parts.WSPLPRICE, parts.IMGFILENAME, parts.DEXT_LOWSTOCKQTY, discount.DISCOUNT, discount.OFFERQTY, discount.OFFERDES, discount.OFFERID, discount.DEXT_OFFERCODE, stock.TBALANCE FROM `discount` INNER JOIN parts on discount.DEXT_OFFERPARTNAME = parts.PARTNAME INNER JOIN stock ON discount.DEXT_OFFERPARTNAME = stock.PARTNAME WHERE discount.OFFERID = :offerId";

    try {
        // Get DB Object
        $db = new db();
        // Connect
        $db = $db->connect();

        $stmt = $db->prepare($sql);
        $stmt->bindValue(':offerId', $offer_id, PDO::PARAM_INT);
        // $stmt->debugDumpParams();
        // die;
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        // print_r($result );die;
        return $response->withStatus(200)->withJson($result);
    } catch (PDOException $e) {
        echo '{"error": {"text": ' . $e->getMessage() . '}';
    }


    // print_r($response);die;

    return $response;
});


$app->get('/check-token', function (Request $request, Response $response, array $args) {
    $dotenv_file = dirname(__DIR__, 1) . '/.env';
    $dotenv_contents = file_get_contents($dotenv_file);
    $dotenv_vars = parse_ini_string($dotenv_contents);

    $token = $request->getQueryParams('token')['token'];
    $token_parts = explode(' ', $token);

    if ($token_parts[0] === 'Bearer') {
        $token = $token_parts[1];
    }
    if (!$token) {
        //return $response->withStatus(202)->withJson(['error' => 'Unauthorized']);
        return $response->withStatus(200)->withJson(['isTokenValid' => false]);
    }
    try {
        $decoded = JWT::decode($token, $dotenv_vars['SECRET'], array('HS512'));
        $data_string = serialize($decoded);
        //print_r($decoded->sub->username);die;
        //file_put_contents($file, $data_string, FILE_APPEND);

        //return $response->withStatus(200)->withJson(['message' => 'Token is valid']);
        return $response->withStatus(200)->withJson(['isTokenValid' => true, "role" => $decoded->role, "userId" => $decoded->sub->username]);
    } catch (\Throwable $th) {

        return $response->withStatus(401)->withJson(['error' => 'Unauthorized']);
    }
});


$app->get('/stock', function (Request $request, Response $response, array $args) {

    $sql = "SELECT * FROM `stock`";

    try {

        // Get DB Object
        $db = new db();
        $db = $db->connect();

        $stmt = $db->prepare($sql);

        // $stmt->debugDumpParams();
        // die;
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        // print_r($result );die;
        return $response->withStatus(200)->withJson($result);
    } catch (PDOException $e) {
        echo '{"error": {"text": ' . $e->getMessage() . '}';
    }
});

$app->get('/stock-detailed', function (Request $request, Response $response, array $args) {

    $sql = "SELECT * FROM `stock_detailed`";

    try {

        // Get DB Object
        $db = new db();
        $db = $db->connect();

        $stmt = $db->prepare($sql);

        // $stmt->debugDumpParams();
        // die;
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        // print_r($result );die;
        return $response->withStatus(200)->withJson($result);
    } catch (PDOException $e) {
        echo '{"error": {"text": ' . $e->getMessage() . '}';
    }
});

$app->get('/report', function (Request $request, Response $response) { {
        $userFullId = $request->getQueryParams('id')['id'];
        $selectedOption = $request->getQueryParams('opt')['opt'];
        $startDate = $request->getQueryParams('str')['str'];
        $endDate = $request->getQueryParams('end')['end'];
        // $jsonPayload = $request->getParsedBody();

        // return $response->withStatus(200)->withJson($jsonPayload['userFullId']);
        $startDate = DateTime::createFromFormat('Y-m-d', $request->getQueryParams('str')['str']);
        $formattedStartDate = $startDate->format('Ymd');
        $endDate = DateTime::createFromFormat('Y-m-d', $request->getQueryParams('end')['end']);
        $formattedEndDate = $endDate->format('Ymd');
        $sqlSupplier = "SELECT SUP FROM dim_suppliers WHERE SUPNAME = '$userFullId' ";
        // return $response->withStatus(200)->withJson($sqlSupplier);

        try {

            $db = new db();
            $db = $db->connectKedi();

            $stmt = $db->prepare($sqlSupplier);

            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $supNum = $result[0]['SUP'];

            $sqlInvoices = "SELECT VENDOR_ID,sum(QTY) as QTY,sum(NET_VALUE) as NET_VALUE , sum(LINE_DISC) as LINE_DISC, CUSTDES, sum(TOTAL_VALUE_INCL_VAT - TOTAL_VALUE) as VAT, sum(TOTAL_VALUE_INCL_VAT) as TOTAL_VALUE_INCL_VAT  FROM bi.fact_invoiceitems inner join dim_customers on dim_customers.CUST = fact_invoiceitems.CUST where fact_invoiceitems.IVDATE between $formattedStartDate AND $formattedEndDate and VENDOR_ID=$supNum group by  dim_customers.CUSTDES";
            // return $response->withStatus(200)->withJson($sqlInvoices);
            //SELECT VENDOR_ID,sum(QTY),sum(NET_VALUE) , sum(LINE_DISC) as LINE_DISC, CUSTDES, sum(TOTAL_VALUE_INCL_VAT - TOTAL_VALUE) as VAT, sum(TOTAL_VALUE_INCL_VAT) as TOTAL_VALUE_INCL_VAT  FROM bi.fact_invoiceitems inner join dim_customers on dim_customers.CUST = fact_invoiceitems.CUST where fact_invoiceitems.IVDATE between 20240500 AND  20250000 and VENDOR_ID=63 group by  dim_customers.CUSTDES
            // return $response->withStatus(200)->withJson($sqlInvoices);

            $stmt = $db->prepare($sqlInvoices);

            // $stmt->debugDumpParams();
            // die;
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // return $response->withStatus(200)->withJson($result);

            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();

            // Add data to the spreadsheet (you need to customize this based on your data structure)
            $row = 1;
            $sheet->setCellValue('A' . $row, 'VENDOR_ID');
            $sheet->setCellValue('B' . $row, 'QTY');
            $sheet->setCellValue('C' . $row, 'NET_VALUE');
            $sheet->setCellValue('D' . $row, 'LINE_DISC');
            $sheet->setCellValue('E' . $row, 'VAT');
            $sheet->setCellValue('F' . $row, 'TOTAL_VALUE_INCL_VAT');
            
            foreach ($result as $item) {
                $row++;
                $sheet->setCellValue('A' . $row, $item['VENDOR_ID']);
                $sheet->setCellValue('B' . $row, $item['QTY']);
                $sheet->setCellValue('C' . $row, $item['NET_VALUE']);
                $sheet->setCellValue('D' . $row, $item['LINE_DISC']);
                $sheet->setCellValue('E' . $row, $item['VAT']);
                $sheet->setCellValue('F' . $row, $item['TOTAL_VALUE_INCL_VAT']);
                
            }

            $filename = $userFullId . "_sales_Invoice.xlsx";

            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');

            $response = $response
                ->withHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                ->withHeader('Content-Disposition', 'attachment;filename="' . $filename . '"')
                ->withHeader('Cache-Control', 'max-age=0');
            return $response->withStatus(200);
        } catch (PDOException $e) {
            echo '{"error": {"text": ' . $e->getMessage() . '}';
        }
    }
});
$app->run();
