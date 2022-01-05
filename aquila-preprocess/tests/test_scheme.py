from aquila.scheme import check_type, Technology


def test_check_type():
    raw = "imc"
    target = Technology
    assert check_type(raw, target) == "IMC"
