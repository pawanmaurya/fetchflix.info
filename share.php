<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Stylish Portfolio - Start Bootstrap Theme</title>

    <!-- Bootstrap Core CSS -->

	<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
</head>
<body>
        <!-- Portfolio -->
        <div class = "container">
	<div class="header">
        <ul class="nav nav-pills pull-right" role="tablist">
          <li role="presentation" class="active"><a href="#">Home</a></li>
          <li role="presentation"><a href="#">About</a></li>
          <li role="presentation"><a href="#">Contact</a></li>
        </ul>
        <h3 class="text-muted">Project name</h3>
	</div>
	<div class="col-lg-12 ">
       <div  id = "message">
<?
error_reporting(E_ALL);
ini_set("display_errors", 1);
include_once("db.php");
$db = new DB();
$data = $db->selectData("5453c7232634f");
$data = unserialize($data);
?>
<div class = "row">
<hr/>
</div>
        </div> 
        </div>
        <div id="example_wrapper" class="dataTables_wrapper span8 offset2">
        <table id="movieInfo" class="table table-striped table-bordered">
	<thead>
	<td>Movie</td>
	<td>Imdb Rating</td>
	<td>Trailer</td>
	<td>Genres</td>
        </thead>
<?


foreach ($data as $movie=>$movieData)
{
echo "<tr>";
	echo '<td><a target="_blank" href = "http://www.imdb.com/title/' . $movieData[0] . '">' . $movie . '</a></td>';
	echo "<td><span class = 'text-center'>$movieData[1]</span></td>";
	echo '<td><a target="_blank" href="http://youtu.be/'  . $movieData[2]. '"><img src = "youtube.png" alt = "youtube link" title = "Trailer"/></a></td>';
	echo "<td>$movieData[3]</td>";
echo "</tr>";
}
?>
        </table>
        </div>


</body>
    <script  type="text/javascript" language="javascript"  src='http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js'></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
    <script  type="text/javascript" language="javascript"  src='//cdnjs.cloudflare.com/ajax/libs/datatables/1.10.1/js/jquery.dataTables.min.js'></script>
    <script  type="text/javascript" language="javascript"  src='https://cdn.datatables.net/plug-ins/725b2a2115b/integration/bootstrap/3/dataTables.bootstrap.js'></script>

    <link rel="stylesheet" href = "http://cdn.datatables.net/plug-ins/725b2a2115b/integration/bootstrap/3/dataTables.bootstrap.css">

<script type= "text/javascript">
$(document).ready(function () {
	$('#movieInfo').DataTable({
		"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
	        "bAutoWidth": false,
                "bProcessing": true,
                "oLanguage": {
                "sEmptyTable": "Wait! list movies ..."
            },
                "order": [   
                [1, "desc"]  //short by imdb rating
            ],	
});
	
        $('input[type=search]').css('width', '200');
        $('.dataTables_filter input').attr("placeholder", "Filter by ratings, genres, names");
});
</script>
</html>
