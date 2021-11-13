const { Matrix } = require("ml-matrix");
const fs = require('fs');

var inputFile = fs.readFileSync("test3.txt", "utf8");
//console.log(inputFile);
let predictedArr = inputFile.split("\n");
let inputArr = inputFile.split("\n");
let i = 0;
for(row of inputArr){
    inputArr[i] = row.trim().split(" ");
    predictedArr[i] = row.trim().split(" ");
    if(i != 1 && i != 2){
        let x = 0;
        for(item of inputArr[i]){
            inputArr[i][x] = parseInt(item);
            predictedArr[i][x] = parseInt(item);
            x++;
        }
    }
    i++;
}
//console.log(inputArr); //good here
i = 0;
let neighbourhood = 2;

while(i < inputArr[0][0]){
    let x = 0;
    let similarityMap = new Map();
    if(predictedArr[i + 3].includes(-1)){
        while(1){
            if(predictedArr[i + 3].includes(-1)){
                //console.log(similarityMap.entries());//3 seems to be looping here for some reason
                if(similarityMap.size>0){
                    let missing = predictedArr[i + 3].findIndex(needed);
                    predictedArr[i + 3][missing] = predictedScore(average(inputArr[i + 3]), similarityMap, inputArr, missing, maxKeys(similarityMap, neighbourhood));
                    //console.log(inputArr);
                    //console.log("missing:" + missing); //this part works 2
                }else{
                    while(x < inputArr[0][0]){
                        if(x == i){
                            similarityMap.set(x, '');
                        }else{
                            similarityMap.set(x ,similarity(inputArr[i + 3], inputArr[x + 3], inputArr[0][1]));
                        }
                        //console.log("x" + x);
                        x++;
                    }
                }
            }else{
                break;
            }
        }
    }
    i++;
}





console.log(predictedArr);









//console.log(similarity(inputArr[3], inputArr[4], inputArr[0][1]));

//making the matrix from the data from the file.

function predictedScore(avg, simScore, ratings, target, arr){
    let numerator = 0;
    let denominator = 0;
    for(num of arr){
        denominator += simScore.get(num);
        numerator += (simScore.get(num) * (ratings[num + 3][target] - average(ratings[num + 3])));
    }
    let newScore = (avg + (numerator/denominator));
    if(newScore > 5){
        newScore = 5;
    }else if(newScore < 0){
        newScore = 0;
    }
    //console.log("avg: "  + avg + "\nsimScore: " + simScore + "\nratings: " + ratings + "\ntarget: " + target + "\narr: " + arr);
    //console.log(newScore);
    return newScore;
    //return Math.round((newScore + Number.EPSILON) * 100) / 100;
}

function similarity(a, b, m){
    let averageA = average(a);
    let averageB = average(b);
    //console.log(a);
    //console.log(b);
    //console.log(averageA);
    //console.log(averageB);

    let numerator = 0;
    let missing = [];
    let i = 0;
    while(i < m){
        if(a[i] != -1 && b[i] != -1){
            numerator += ((a[i] - averageA)*(b[i] - averageB))
        }else{
            missing.push(i);
        }
        i++;
    }
    let denominator = stdDeviaton(a, missing, averageA)*stdDeviaton(b, missing, averageB);
    //console.log(numerator/denominator);
    return (numerator/denominator);

}

function average(arr){
    let sum = 0;
    let count = 0;
    for(num of arr){
        if(num != -1){
            sum += num;
            count++;
        }
    }
    return(sum/count);
}

function stdDeviaton(arr, missing, avg){
    let sum = 0;
    let i = 0;
    while(i < arr.length){
        if(!missing.includes(i)){
            sum += ((arr[i] - avg) * (arr[i] - avg));
        }
        i++;
    }
    return(Math.sqrt(sum))
}

function needed(num){
    return num == -1;
}

function maxKeys(map, neighbourhood){
    let positionArr = [];
    let valueArr = [];
    //console.log(map); seems ok
    for(item of map){
        if(item[1] != ''){
            if(positionArr.length == 0){
                positionArr.push(item[0]);
                valueArr.push(item[1]);
            }else if(item[1] > valueArr[0]){
                valueArr.unshift(item[1]);
                positionArr.unshift(item[0]);
            }else if(positionArr.length == 1){
                valueArr.push(item[1]);
                positionArr.push(item[0]);
            }else if(item[1] > valueArr[1]){
                valueArr[1] = item[1];
                positionArr[1] = item[0];
            }
        }
    }
    //console.log(positionArr)
    //console.log(positionArr);
    //console.log(valueArr);
    return positionArr.splice(0, neighbourhood);
}