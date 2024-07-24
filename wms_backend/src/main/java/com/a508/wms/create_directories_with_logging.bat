@echo off
setlocal enabledelayedexpansion

set "domainFile=domains.txt"
set "nameFile=names.txt"

set "baseDir=C:\Users\SSAFY\IdeaProjects\S11P12A508\wms_backend\src\main\java\com\a508\wms\location"

set "logFile=create_directories_log.txt"

pause


    for /f "delims=" %%n in (%nameFile%) do (
        set "name=%%n"
        set "dirName=!domain!!name!"
        md "%baseDir%\!dirName!" 2>nul
       
    )


endlocal
