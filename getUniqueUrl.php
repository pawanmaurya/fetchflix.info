<?
error_reporting(E_ALL);
ini_set("display_errors", 1);

if (parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST) != $_SERVER['SERVER_NAME'])
	echo "sds";

include_once("db.php");

$db = new DB();
$movieData = $_POST['movieData'];
$movieData = serialize($movieData);

$uniqueUrlId = $db->insertData($movieData);
if($uniqueUrlId)
	echo $uniqueUrlId;
?>

