import { from, interval, of } from 'rxjs';
import { bufferCount, bufferTime, catchError, concatMap, concatMapTo, delay, exhaustMap, map, mapTo, mergeMap, take, tap, timeout, toArray } from 'rxjs/operators';

interface Project {
    ref: string;
    sortCategory?: string;
}

const projects: Project[] = [
    { ref: "a" },
    { ref: "b" },
    { ref: "c" },
    { ref: "d" },
    { ref: "e" },
];

async function getCategoryName(ref: string): Promise<string> {
    return new Promise((resolve, reject) => {
        if (ref === "c") {
            reject("404");
        } else {
            setTimeout(() => resolve("category " + ref), 1000);
        }
    });
}

function getData() {
    return of(...projects).pipe(

        concatMap(proj =>
            from(getCategoryName(proj.ref)).pipe(
                catchError((err, proj) => of('err')),
                map<string, Project>(cat => ({ ...proj, sortCategory: cat }))
            ))
    );
}

//getData().toPromise().then(newprojs => console.log(newprojs));
//getData().subscribe(v => console.log(v));

const every = interval(500).pipe(take(20));
const fakeRequest = (v: number) => of("Network request #" + v).pipe(delay(Math.random() * 2000));
every.pipe(mapTo(5), tap(v => console.log(v)), exhaustMap(v => fakeRequest(v))).subscribe(v => console.log(v));