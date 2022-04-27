from .de_test import test

from .gaussian_process import GP, SGPIPM, GPControl, fit, fit_fast, fit_detailed

import tensorflow as tf

gpus = tf.config.experimental.list_physical_devices("GPU")
if gpus:
    try:
        for gpu in gpus:
            tf.config.experimental.set_memory_growth(gpu, True)
        logical_gpus = tf.config.experimental.list_logical_devices("GPU")
    except RuntimeError as e:
        print(e)
del tf
del gpus
