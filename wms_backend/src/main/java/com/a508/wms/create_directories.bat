@echo off
setlocal enabledelayedexpansion

REM 도메인과 이름이 저장된 파일 경로
set "domainFile=domains.txt"
set "nameFile=names.txt"

REM 디렉토리를 생성할 기본 경로
set "baseDir=C:\Users\SSAFY\IdeaProjects\S11P12A508\wms_backend\src\main\java\com\a508\wms\floor"

REM 도메인 파일이 존재하는지 확인
if not exist "%domainFile%" (
    echo 도메인 파일 %domainFile% 이(가) 존재하지 않습니다.
    exit /b 1
)

REM 이름 파일이 존재하는지 확인
if not exist "%nameFile%" (
    echo 이름 파일 %nameFile% 이(가) 존재하지 않습니다.
    exit /b 1
)

REM 도메인 파일을 한 줄씩 읽어서 처리
for /f "delims=" %%d in (%domainFile%) do (
    set "domain=%%d"

    REM 이름 파일을 한 줄씩 읽어서 처리
    for /f "delims=" %%n in (%nameFile%) do (
        set "name=%%n"
        set "dirName=!domain!!name!"
        md "%baseDir%\!dirName!" 2>nul
        if errorlevel 1 (
            echo 디렉토리 %baseDir%\!dirName! 생성 실패
        ) else (
            echo 디렉토리 %baseDir%\!dirName! 생성 성공
        )
    )
)

endlocal
