use statrs::distribution::{ChiSquared, ContinuousCDF, Normal};

pub fn mean_f(numbers: &Vec<f64>) -> f64 {
    let l = numbers.len();
    if l > 0 {
        let sum: f64 = numbers.iter().sum();
        sum / l as f64
    } else {
        0.0
    }
}

pub fn std_f(numbers: &Vec<f64>) -> f64 {
    let l = numbers.len();
    if l > 0 {
        let m = mean_f(numbers);
        let variance = numbers
            .iter()
            .map(|value| {
                let diff = m - (*value as f64);
                diff * diff
            })
            .sum::<f64>()
            / l as f64;
        variance.sqrt()
    } else {
        0.0
    }
}

pub fn zscore2pvalue(z: f64, two_tailed: bool) -> f64 {
    let norm_dist: Normal = Normal::new(0.0, 1.0).unwrap(); // follow the scipy's default
    let mut p: f64 = if z > 0.0 {
        1.0 - norm_dist.cdf(z)
    } else { norm_dist.cdf(z) };

    if two_tailed { p *= 2.0 }

    p
}

pub fn chisquare2pvalue(chi2_value: f64, ddof: f64) -> f64 {
    let chi2_dist: ChiSquared = ChiSquared::new(ddof).unwrap();
    1.0 - chi2_dist.cdf(chi2_value)
}
