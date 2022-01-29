import numpy as np
import pandas as pd
import humanize
import fire

from multiprocessing import Process

alphabet = list('abcdefghijklmnopqrstuvwxyz')

millnames = ['', 'K', 'M', ' B', ' T']


def millify(n):
    n = float(n)
    millidx = max(0, min(len(millnames) - 1,
                         int(np.floor(0 if n == 0 else np.log10(abs(n)) / 3))))

    return '{:.0f}{}'.format(n / 10 ** (3 * millidx), millnames[millidx])


def rwords(count):
    a = np.random.randint(5, 10)
    return [''.join(np.random.choice(alphabet, a)) for _ in range(count)]


def cell_info(cell_roi, cell_type, total_literal):
    cell_type_pool = rwords(30)
    x_pool = []
    y_pool = []
    t_pool = []
    for c in cell_roi:
        x = np.random.randint(0, 10000, c) / 100
        y = np.random.randint(0, 10000, c) / 100
        x_pool += x.tolist()
        y_pool += y.tolist()
        if cell_type:
            t = np.random.choice(cell_type_pool, c)
            t_pool += t.tolist()
    if cell_type:
        pd.DataFrame({
            "cell_x": x_pool,
            "cell_y": y_pool,
            "cell_type": t_pool,
        }).to_csv(f"{total_literal}_Cell_Info_File_withT.csv", index=False)
    else:
        pd.DataFrame({
            "cell_x": x_pool,
            "cell_y": y_pool,
        }).to_csv(f"{total_literal}_Cell_Info_File_noT.csv", index=False)


def exp_info(total, markers_num, total_literal):
    data = np.random.randint(0, 100000, (total, markers_num)) / 10
    pd.DataFrame(data, columns=rwords(markers_num)).to_csv(f"{total_literal}_Exp_File.csv", index=False)


def roi_file(roi_level, roi_count, frac, total_literal):
    roi_names = [rwords(roi_level) for _ in range(roi_count)]
    records = []
    for i in roi_names:
        records += [i for _ in range(frac)]
    pd.DataFrame(records, columns=rwords(roi_level)).to_csv(f"{total_literal}_ROI_File.csv", index=False)


def main(
        total: int = 1000,
        roi_level: int = 3,
        roi_count: int = 10,
        cell_type: bool = True,
        markers_count: int = 10000,
):
    frac = int(total / roi_count)
    total = frac * roi_count
    total_literal = humanize.intword(total)
    cell_roi = [frac for _ in range(roi_count)]

    p1 = Process(target=roi_file, args=(roi_level, roi_count, frac, total_literal))
    p2 = Process(target=cell_info, args=(cell_roi, cell_type, total_literal))
    p3 = Process(target=exp_info, args=(total, markers_count, total_literal))

    p1.start()
    p2.start()
    p3.start()

    p1.join()
    p2.join()
    p3.join()


if __name__ == '__main__':
    fire.Fire(main)
