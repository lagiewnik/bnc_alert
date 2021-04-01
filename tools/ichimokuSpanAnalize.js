// sygnały >= 10 -10 znaczące
function crossKijunPrice (k, k_prev, p, p_prev) {
// zwraca 0 gdy nie było przecięcia lub linie się pokrywają
//zwraca - 1 gdy cena przecieła w dół kijun
//zwraca 1    gdy cena przecieła w górę kijun 
    if ((k-p)*(k_prev-p_prev) <= 0) {
        return Math.sign(p-k)*10
    }
    else{
        return 0
    }
}

function crossKijunTenkan (k, k_prev, t, t_prev) {
// zwraca 0 gdy nie było przecięcia lub linie się pokrywają
//zwraca - 1 gdy tenkan przecieła w dół kijun
//zwraca 1    gdy tenkan przecieła w górę kijun 
    if ((k-t)*(k_prev-t_prev) <= 0) {
        return Math.sign(t-k) * 10
    }
    else{
        return 0
    }
}

function crossPriceChikou (p, p_prev, c, c_prev) {
    // zwraca 0 gdy nie było przecięcia lub linie się pokrywają
    //zwraca - 1 gdy tenkan przecieła w dół kijun
    //zwraca 1    gdy tenkan przecieła w górę kijun 
        if ((p-c)*(p_prev-c_prev) <= 0) {
            return Math.sign(c-p) * 10
        }
        else{
            return 0
        }
    }


function crossVSKumo(k, k_prev, t, t_prev, sA, sA_prev, sB, sB_prev) {
    // zwraca 0 gdy nie było przecięcie, zwraca 2 gdy przecięcie nad, -2 pod chmurą, 1 w chmurze
    const fake_x0 = 0
    const fake_x1 = 1
    if (crossKijunTenkan(k, k_prev, t, t_prev) == 0) {
        return 0
    }
    //Wyznacz współczynniki a i b równania y = ax + b  linii k i t 
    k_eq = calcFactorStraight(fake_x0, fake_x1, k_prev, k)
    t_eq = calcFactorStraight(fake_x0, fake_x1, t_prev, t)
    // x = (b1 - b2)/(a2 - a1);
    // y = (a2 * b1 - b2 * a1) / (a2 - a1);
    //wyznacz punkt przeciecia k i t
    cross_x = (k_eq.b - t_eq.b) / (t_eq.a - k_eq.a)
    cross_y = (t_eq.a * k_eq.b - t_eq.b * k_eq.a) / (t_eq.a - k_eq.a)

    console.log(cross_x + "," + cross_y)
    sA_eq = calcFactorStraight(fake_x0, fake_x1, sA_prev, sA)
    sB_eq = calcFactorStraight(fake_x0, fake_x1, sB_prev, sB)

    sA_Y = sA_eq.a * cross_x + sA_eq.b
    sB_Y = sB_eq.a * cross_x + sB_eq.b
    console.log("SA_Y: " + sA_Y)
    console.log("SB_Y: " + sB_Y)
    if (cross_y > sA_Y && cross_y > sB_Y) {
        return 10
    }
    else if (cross_y < sA_Y && cross_y < sB_Y) {
        return -10
    }
    else return 5

    //return {"x": cross_x, "y": cross_y}

}

function kumoColor(sA, sA_prev, sB, sB_prev) {
    //-1 chmura spadkowa,  -2 przejście w chmura spadkowa; 0-linie pokryte; 1 chmura wzrostowa; 2 wejście w chmure wzrostowa
    if ((sA-sB)*(sA_prev-sB_prev) <= 0) {
        return Math.sign(sA-sB)*10
    }
    else{
        return Math.sign(sA - sB)*5
    } 
}

function priceVsKumo(p, p_prev, sA, sA_prev, sB, sB_prev) {
    // -5 - cena utrzymuje się pod chmura
    // -15 - cena przebiła chmurę w dół
    // -10 - cena spadła poniżej chmury z chmury  
    // -11 - cena spadła w dół w chmurę
    // 0 - cena w chmurze utrzymana
    // 11 - cena weszła w górę w chmurę
    // 10 - cena wyszła powyżej chmury z chmury  
    // 15 - cena przebiła chmurę w góre
    // 5 - cena utrzymuje się nad chmura

    if ( (p <= sA && sB <= p) || (p >= sA && sB >= p) ) {
        if(p_prev >= sA_prev && p_prev >= sB_prev){
            return -11
        } 
        else if(p_prev <= sA_prev && p_prev <= sB_prev)
            return 11
        else 
            return 0
    }
    else if(p >= sA && p >= sB ) {
        if (p_prev >= sA_prev && p_prev >= sB_prev)
            return 5
        else if ((p_prev <= sA_prev && p_prev <= sB_prev))
            return 15
        else
            return 10
    }
    else{
        if (p_prev >= sA_prev && p_prev >= sB_prev)
            return -15
        else if ((p_prev <= sA_prev && p_prev <= sB_prev))
            return -5
        else
            return -10
    }
}
function s3line(t, t_prev, k, k_prev, sA, sA_prev, sB, sB_prev) {
    if(t>k && k>sA &sA >sB){
        if(t_prev > k_prev && k_prev > sA_prev && sA_prev > sB_prev){
            return 5
        }
        else{
            return 10
        }
    }
    else if (t<k && k<sA &sA <sB){
        if(t_prev < k_prev && k_prev < sA_prev && sA_prev < sB_prev){
            return -5
        }
        else{
            return -10
        }
    }
    else return 0
}

function calcFactorStraight(fake_x0, fake_x1, y0, y1) {
    //wyznacza współczynniki rownania prostej y = ax + b
    // a = (y1 - y0)/(x1 - x0);
    // b = y0 - a * x0;

    a= (y1-y0)/(fake_x1 - fake_x0)
    b = y0 - a*fake_x0
    return {"a": a , "b":b}
}


//
// x=crossKijunPrice(12,3,12,2)
// console.log(x)
// param = calcFactorStraight(0,1,16.455,45.15666)
// console.log(param)

//console.log(crossVSKumo(2, 4, 3, 3, 0, 2, 2, 0))


module.exports = {
    crossKijunPrice, crossKijunTenkan, crossPriceChikou, crossVSKumo, kumoColor, priceVsKumo, s3line
}
//console.log(priceVsKumo(0,4, 2, 2, 5, 5))
