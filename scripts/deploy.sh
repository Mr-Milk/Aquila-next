#!/bin/sh

cd ~/projects/Aquila-next

git pull

git diff --quiet HEAD^ HEAD ./aquila-api

STATUS=$?

if [ $STATUS -eq 0 ]
then
        echo "File unchanged in ./aquila-api, ignore rebuild step"
else
        echo "Rebuilding..."
        cd aquila-api
        SERVER_PID="$(pidof aquila-api)"
        echo "Terminate current running process at $SERVER_PID"
        kill $SERVER_PID
        cargo build --release
        nohup ./target/release/aquila-api > log.out 2>&1 &
        echo "New process running at $(pidof aquila-api)"
fi

exit 0