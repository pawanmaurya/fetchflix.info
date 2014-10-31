<?
error_reporting(E_ALL);
ini_set("display_errors", 1);
//echo parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST);

include_once("db.php");

$db = new DB();
$db->createTable();
/*
$movieData = $_POST['movieData'];
$movieData = serialize($movieData);

$uniqueUrlId = insertData($movieData);

if($uniqueUrlId)
	echo "$uniqueUrlId";
else
	return NULL;

/*
$uniqueId = uniqid();
$result = pg_query($pg_conn, "select * from unique_id_to_movies");
print "<pre>\n";
if (!pg_num_rows($result)) {
  print("Your connection is working, but your database is empty.\nFret not. This is expected for new apps.\n");
} else {
  print "Tables in your database:\n";
  while ($row = pg_fetch_row($result)) { print("- $row[0]\n"); }
}
print "\n";
 */
?>

