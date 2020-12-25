let mainTranslations = [{text:'aa'},{text:'bb'},{text:'cc'},{text:'xixi'},
{text:'aabb'},{text:'xddx'},{text:'kk'},
{text:'coco'},{text:'chuchu'}];

let otherTranslations = [{fr:5,text:'chuchu'},
{fr:3,text:'cc'}, {fr:6,text:'dd'}, {fr:1,text:'bb'}, {fr:4,text:'aa'},{fr:3,text:'coco'},
{fr:1,text:'xixi'}];

let allTranslations = [];
for(let main = 0; main < mainTranslations.length; main++) {
    for(let other = 0; other < otherTranslations.length; other++) {
        if(otherTranslations[other].text.toLowerCase() == mainTranslations[main].text.toLowerCase()) {
            mainTranslations.splice(main,1);
            main--;
            break;
        }
    }
}

console.log(mainTranslations);
//console.log(otherTranslations);


// let x = [1,2,3,4,5,6];
// console.log(x[3]);
// x.splice(3,1);
// console.log(x[3]);