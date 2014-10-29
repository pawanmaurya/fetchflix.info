<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
    $url=parse_url(getenv("CLEARDB_DATABASE_URL"));

    $server = $url["host"];
    $username = $url["user"];
    $password = $url["pass"];
    $db = substr($url["path"],1);

    mysqli_select_db($db);
    $conn = new mysqli($server, $username, $password);



    $sql = "create table demo (id int, name varchar(255))";

    if (mysqli_query($conn, $sql)) {
    echo "Database created successfully";
    } else {
    echo "Error creating database: " . mysqli_error($conn);
}
?>
