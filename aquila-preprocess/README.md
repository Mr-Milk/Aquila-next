# How to prepare data

## 1 Create entry for the data

Most of the information about the data need
to input manually, here is a template to create
a metadata dict.

```python
import aquila as aq

meta = {
    'technology': 'STARmap',
    'species': 'Mouse',
    'organ': 'Brain',
    'tissue': 'Visual Cortex',
    'molecule': 'RNA',
    'disease': None,
    'doi': 'https://doi.org/10.1126/science.aat5691',
    'is_single_cell': True,
    'has_cell_type': False,
    'is_3d': True,
    'obscure': 'sequential'
}

meta = aq.full_meta(meta)
```

Calling `full_meta` will validate most of the fields in the meta and return the correct literal.

## 2 Convert raw data to `.h5ad` format

obs field:
```python
required = ['cell_x', 'cell_y'] # and ROI information key
optional = ['cell_z', 'cell_type'] 
```

var field:
```python
required = ['markers']
```

uns field:
```python
required = ['meta', 'roi_cols']
```

After create a data that looks like this

```text
AnnData object with n_obs × n_vars = 33598 × 28
    obs: 'cell_x', 'cell_y', 'cell_z', 'ROI'
    var: 'markers'
    uns: 'meta', 'roi_cols'
```

When calling `aq.save_data`

This will filter 
1. cells with no expression
2. zero count gene

And then perform CPM normalization

```python
import aquila as aq
export = "intermid-data"
aq.save_data(data, export)
```

## 3 Dump to database

```python
import aquila as aq
aq.data2db(data)
```