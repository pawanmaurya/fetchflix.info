<?
echo parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST);

$movieData = $_POST['movieData'];
echo "movieData ".$movieData;
?>
