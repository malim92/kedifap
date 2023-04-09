<?php


// Define the path to the .env file
$dotenv_file = __DIR__.'\.env';
print_r(__DIR__.'\.env');

// Open the .env file and read its contents
$dotenv_contents = file_get_contents($dotenv_file);

// // Parse the .env file contents into an array of environment variables
$dotenv_vars = parse_ini_string($dotenv_contents);
print_r($dotenv_vars);
// // Load the environment variables into the PHP environment
foreach ($dotenv_vars as $key => $value) {
    putenv("$key=$value");
}