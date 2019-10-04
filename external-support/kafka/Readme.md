删除
log.cleanup.policy=delete启用删除策略
直接删除，删除后的消息不可恢复。可配置以下两个策略：
清理超过指定时间清理：  
log.retention.hours=16
超过指定大小后，删除旧的消息：
log.retention.bytes=1073741824


压缩
将数据压缩，只保留每个key最后一个版本的数据。
首先在broker的配置中设置log.cleaner.enable=true启用cleaner，这个默认是关闭的。
在topic的配置中设置log.cleanup.policy=compact启用压缩策略。

启动命令	do to directory root
Linux
./bin/kafka-server-start.sh –daemon config/server.properties
./bin/kafka-server-start.sh  .config/server.properties

Windows
./bin/windows/kafka-server-start.bat  .config/server.properties
