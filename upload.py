#!/usr/bin/python
# coding=utf-8

import paramiko
import os

def sftp_exec_command(command,host,port,username,password):
    try:
        ssh_client = paramiko.SSHClient()
        ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh_client.connect(host,port,username,password)
		#sftp = paramiko.SFTPClient.from_transport(ssh_client)
        path_list = os.listdir("\usr\local\nginx\html\cjpt")
        std_in,std_out,std_err=ssh_client.exec_command(command)
        for filen in path_list:
            print filen.strip("\n")
        ssh_client.close()
    except Exception,e:
        print e

def sftp_upload(host,port,username,password,_local,_remote):
    sf = paramiko.Transport((host,port))
    sf.connect(username=username,password=password)
    sftp = paramiko.SFTPClient.from_transport(sf)
    try:
        print(_local,_remote)
        #print
        for root, dirs, files in os.walk(_local):  
            print(root) #当前目录路径  
            #print(dirs) #当前路径下所有子目录  
            print(files) #当前路径下所有非目录子文件

        #print os.path.join(_remote,'index.html')
        sftp.put(_local,_remote)
    except Exception,e:
        print('exception:',e)
    sf.close()

if __name__ == '__main__':
    host = '39.108.139.53'
    port = 22
    username = 'root'
    password = '123123Wsk'
    local_path = './cjpt/index.html'
    remote_path = '/usr/local/nginx/html/cjpt/index.html'
    sftp_upload(host,port,username,password,local_path,remote_path)
    #sftp_exec_command("ls -l",host,port,username,password)