<?php



class db
{
    // Properties
    private $dbhost;
    private $dbuser;
    private $dbpass;
    private $dbname;

    // Connect
    public function connect()
    {
        $DOTENV_FILE = dirname(__DIR__, 2) . '/.env';
        $dotenv_contents = file_get_contents($DOTENV_FILE);

        // Parse the .env file contents into an array of environment variables
        $dotenv_vars = parse_ini_string($dotenv_contents);

        $this->dbhost = $dotenv_vars['DB_HOST'];
        $this->dbuser = $dotenv_vars['DB_USER'];
        $this->dbpass = $dotenv_vars['DB_PASS'];
        $this->dbname = $dotenv_vars['DB_NAME'];
        
        $mysql_connect_str = "mysql:host=$this->dbhost;dbname=$this->dbname";
        $dbConnection = new PDO($mysql_connect_str, $this->dbuser, $this->dbpass);
        $dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $dbConnection;
    }

    public function connectKedi()
    {
        $DOTENV_FILE = dirname(__DIR__, 2) . '/.env';
        $dotenv_contents = file_get_contents($DOTENV_FILE);

        // Parse the .env file contents into an array of environment variables
        $dotenv_vars = parse_ini_string($dotenv_contents);

        $this->dbhost = $dotenv_vars['DB_HOST_KEDI'];
        $this->dbuser = $dotenv_vars['DB_USER_KEDI'];
        $this->dbpass = $dotenv_vars['DB_PASS_KEDI'];
        $this->dbname = $dotenv_vars['DB_NAME_KEDI'];
        
        $mysql_connect_str = "mysql:host=$this->dbhost;dbname=$this->dbname";
        $dbConnection = new PDO($mysql_connect_str, $this->dbuser, $this->dbpass);
        $dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $dbConnection;
    }
}
