<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
    $url=parse_url(getenv("CLEARDB_DATABASE_URL"));

    $server = $url["host"];
    $username = $url["user"];
    $password = $url["pass"];
    $db = substr($url["path"],1);

    $conn = new mysqli($server, $username, $password);

    mysqli_select_db($conn, $db);


    $sql = "create table demo (id int, name varchar(255))";

    if (mysqli_query($conn, $sql)) {
    echo "Database created successfully";
    } else {
    echo "Error creating database: " . mysqli_error($conn);
}
?>
