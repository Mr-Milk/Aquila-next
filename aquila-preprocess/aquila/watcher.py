import sys
from pathlib import Path
from datetime import datetime

from rich import print
import pandas as pd

from aquila import data2db


class History:
    filename = ".history.csv"
    path = None
    file = None
    data = None

    def __init__(self, path):
        path = Path(path)
        self.file = path / self.filename
        if self.file.exists():
            self.data = pd.read_csv(self.file)
        else:
            self.data = pd.DataFrame({
                "file": [],
                "status": [],
                "time": []
            })
            self.data.to_csv(self.file, index=False)

    def add(self, record):
        file = record[0]
        r = self.data[self.data['file'] == str(file)]
        if r is None:
            self.data.loc[len(self.data)] = record
        else:
            self.data.loc[r.index] = record
        self.backup()

    def backup(self):
        self.data.to_csv(self.file, index=False)


class Watcher:
    def __init__(self, path):
        self.path = Path(path)
        if not self.path.exists():
            raise FileNotFoundError(f"{self.path} not exist")

    def list_files(self, pattern="*.h5ad"):
        return [i.name for i in self.path.glob(pattern)]


def fire(path):
    import ray
    ray.init()

    path = Path(path)
    history = History(path)
    watcher = Watcher(path)
    current_files = watcher.list_files()
    print(f"Found {len(current_files)} .h5ad files")
    history_files = history.data["file"].tolist()
    history_success = history.data[history.data['status'] == "Success"]["file"].tolist()
    print(f"Previously processed {len(history_files)} .h5ad files, "
          f"success {len(history_success)}, failed {len(history_files) - len(history_success)}")

    @ray.remote
    def data2db_remote(f):
        try:
            data2db(f)
            history.add([f, "Success", datetime.now()])
        except Exception as e:
            print(e, file=sys.stderr)
            history.add([f, "Failed", datetime.now()])

    task_list = []
    for f in current_files:
        if f not in history_success:
            task_list.append(data2db_remote.remote(f))

    ray.get(task_list)
