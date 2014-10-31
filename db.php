<?
# This function reads your DATABASE_URL config var and returns a connection
# string suitable for pg_connect. Put this in your app.
function pg_connection_string_from_database_url() {
  extract(parse_url($_ENV["DATABASE_URL"]));
  return "user=$user password=$pass host=$host dbname=" . substr($path, 1); # <- you may want to add sslmode=require there too
}
# Here we establish the connection. Yes, that's all.
function getDbConn()
{
	$pg_conn = pg_connect(pg_connection_string_from_database_url());
	return $pg_conn;
}

$TABLE = 'unique_id_to_movies';
$MOVIESDATA = 2;

function insertData($movieData)
{
	$uniqueId = uniqid();
	if(selectData($uniqid))
		return insertData($movieData);

	$movieData = mysql_real_escape_string($movieData);		
	$query = "insert into $TABLE (`unique_id`, `movies_data`) 
				values( $uniqueId, $movieData)";	
	$result = pg_query(getDbConn(),$query);
	
	if (pg_affected_rows($result))
		return $uniqueId;
}

function selectData($uniqueId)
{
	$query = "select * from $TABLE where `unique_id` = $uniqueId";
	$result = pg_query(getDbConn(),$query);
	if (!pg_num_rows($result))
		return NULL;
	$row = pg_fetch_row($result);
	return $row[$MOVIESDATA];
	
}

function createTable()
{
	$query = "create table $TABLE(
		s_no int NOT NULL auto_increment,
		unique_id varchar(255) primary key NOT NULL,
		movies_data text NOT NULL
		)";

	$result = pg_query(getDbConn(),$query);
	print_r($result);
}
?>
