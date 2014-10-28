<?
try
{
    $redis = \Redis::instance();
    // Do something with Redis.
}
catch(\RedisException $e)
{
    // Fall back to other db usage.
}
?>
