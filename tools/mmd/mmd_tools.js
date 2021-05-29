function crossline (k, k_prev, t, t_prev) {
    // zwraca 0 gdy nie było przecięcia lub linie się pokrywają
    //zwraca - 1 gdy t przecieła w dół k
    //zwraca 1    gdy t przecieła w górę k 
        if ((k-t)*(k_prev-t_prev) <= 0) {
            return Math.sign(t-k) * 1
        }
        else{
            return 0
        }
    }


function cloudVsCloud(kk, ll, ss, tt){
        if (kk.length<2 || ll.length< 2 || ss.length<2 || tt.length<2){
            return null
        }
        var [k_prev, k] = kk
        var [l_prev, l] = ll
        var [s_prev, s] = ss
        var [t_prev, t] = tt
        console.log("k:" +k + " kprev: " + k_prev + " l: " + l+ " lprev: "+ l_prev + " s: " +s + " sprev: " +  s_prev + " t: " +  t +" tprev: " + t_prev )
        if ((k > s && k > t && l > s && l > t)
            && (crossline(k, k_prev, s, s_prev) < 0 || crossline(k, k_prev, t, t_prev) < 0 || crossline(l, l_prev, s, s_prev) < 0 || crossline(l, l_prev, t, t_prev) < 0)
        ) {
            return 3
        }
        else if ((k < s && k < t && l < s && l < t)
            &&
            (crossline(k, k_prev, s, s_prev) > 0 || crossline(k, k_prev, t, t_prev) > 0 || crossline(l, l_prev, s, s_prev) > 0 || crossline(l, l_prev, t, t_prev) > 0)
        ) {
            return -3
        }
        else if ((crossline(k, k_prev, s, s_prev) < 0 || crossline(k, k_prev, t, t_prev) < 0 || crossline(l, l_prev, s, s_prev) < 0 || crossline(l, l_prev, t, t_prev) < 0) &&!(crossline(k, k_prev, s, s_prev) > 0 || crossline(k, k_prev, t, t_prev) > 0 || crossline(l, l_prev, s, s_prev) > 0 || crossline(l, l_prev, t, t_prev)>0)){
            return 2
        }
        else if ((crossline(k, k_prev, s, s_prev) > 0 || crossline(k, k_prev, t, t_prev) > 0 || crossline(l, l_prev, s, s_prev) > 0 || crossline(l, l_prev, t, t_prev) > 0) &&!(crossline(k, k_prev, s, s_prev) < 0 || crossline(k, k_prev, t, t_prev) < 0 || crossline(l, l_prev, s, s_prev) < 0 || crossline(l, l_prev, t, t_prev)<0)){
            return -2
        }
        else if((k > s && k > t && l > s && l > t)){
            return 1
        }
        else if((k < s && k < t && l < s && l < t)){
            return -1
        }
        else return 0
    }
    //console.log(crossline(4,1,1,1.5))
    //console.log(cloudVsCloud([-6,-4],[-5,-3],[2,2],[1,1]))
    //console.log(cloudVsCloud([4],[-5,-3],[2,2],[1,1]))
    function generate_mmd_signals(mmd_results) {
        let ema_fast = mmd_results.ema_fast
        let ema_short = mmd_results.ema_short
        let ema_mid = mmd_results.ema_mid
        let sma_fast = mmd_results.sma_fast
        let sma_short = mmd_results.sma_short
        let sma_mid = mmd_results.sma_mid


    return {
        "FastVsShortMMD": cloudVsCloud(ema_fast, sma_fast, ema_short, sma_short ),
        "FastVsMiddleMMD": cloudVsCloud(ema_fast, sma_fast, ema_mid, sma_mid),
        "ShortVsMiddleMMD" :  cloudVsCloud(ema_short, sma_short, ema_mid, sma_mid),
        "PriceVsFast": "",
        "PriceVsShort":"" ,
        "PriceVsMiddle": ""
        }
    }
    module.exports = {
        crossline, cloudVsCloud, generate_mmd_signals
    }