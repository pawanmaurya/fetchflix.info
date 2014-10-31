<?
error_reporting(E_ALL);
ini_set("display_errors", 1);
//echo parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST);

include_once("db.php");

$movieData = $_POST['movieData'];
echo "movieData ".$movieData;

$pg_conn = getDbConn();
# Now let's use the connection for something silly just to prove it works:
$result = pg_query($pg_conn, "insert into unique_id_to_movies values('sds','sdsdds')");
print "<pre>\n";
if (!pg_num_rows($result)) {
  print("Your connection is working, but your database is empty.\nFret not. This is expected for new apps.\n");
} else {
  print "Tables in your database:\n";
  while ($row = pg_fetch_row($result)) { print("- $row[0]\n"); }
}
print "\n";
?>

