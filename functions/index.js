/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const functions = require('firebase-functions');
const admin = require("firebase-admin");

var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const express = require('express');
const app = express();
const db = admin.firestore();

const cors = require('cors');
app.use(cors({ origin: true}));

app.get('/hello-world', (req,res) =>{
    return res.status(200).send('Hello world');
});

app.post('/badaga/create', (req, res) => {

    (async () => {
        
        try
        {
            console.log("In creating badaga boys");
            await db.collection('badagaBoys').doc('/'+req.body.id+'/')
            .create({
                userKey: req.body.userKey,
                createdTime: new Date().getTime(),
                modifiedTime: new Date().getTime(),
                fullName: req.body.fullName,
                dob: req.body.dob,
                semmai: req.body.semmai,
                maritalStatus: req.body.maritalStatus,
                height: req.body.height,
                education: req.body.education,
                occupation: req.body.occupation,
                annualIncome: req.body.annualIncome,
                country: req.body.country,
                isVerifiedProfile: req.body.isVerifiedProfile,
                physicalStatus: req.body.physicalStatus,
                profileStatus: req.body.profileStatus,
                profileMemberShip: req.body.profileMemberShip,
                photoUrl: req.body.photoUrl,
                gender: req.body.gender,
                religion: req.body.religion,
                weight: req.body.weight,
                company: req.body.company,
                hatty: req.body.hatty,
                state: req.body.state,
                city: req.body.city,
                star: req.body.star,
                zodiacSign: req.body.zodiacSign,
                eatingHabbits: req.body.eatingHabbits,
                drinkingHabits: req.body.drinkingHabits,
                smokingHabits: req.body.smokingHabits,
                father: req.body.father,
                mother: req.body.mother,
                fatherOccupation: req.body.fatherOccupation,
                motherOccupation: req.body.motherOccupation,
                siblingBrotherCount: req.body.siblingBrotherCount,
                siblingSisterCount: req.body.siblingSisterCount,
                interests: req.body.interests,
                desecription: req.body.desecription
            })

            return res.status(200).send();
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

app.get('/badaga/getProfiles', (req, res) => {

    (async () => {
        
        try
        {
            // Input area start:
            var startAfterKey = req.query.startAfterKey;
            var limit = req.query.limit;
            console.log("start after key: " + startAfterKey);
            console.log("limit: " + limit);
            // Input area end;

            // Other variables:
            var nextKey = undefined;
            var recordsRetrieveCount = 10;
            var maxIteration = 5;
            // Other variables end;
            
            // output area start:
            let response = [];
            // Output area end;
            
            // Filter input area. Now from request. Later from db.
            var isAgeFilterSet = req.query.isAgeFilter;
            var minAge = req.query.minAge;
            var maxAge = req.query.maxAge;
            var semmai = req.query.semmai;
            var isHeightFilterSet = req.query.isHeightFilter;
            var minHeight = req.query.minHeight;
            var maxHeight = req.query.maxHeight;
            var isIncomeFilerSet = req.query.isIncomeFilter;
            var minIncome = req.query.minIncome;
            var maxIncome = req.query.maxIncome;
            var country = req.query.country;
            var isVerified = req.query.isVerified;

            if (country!=undefined && country.trim().length === 0)
            {
                country = undefined;
            }

            console.log("Filter isAgeFilterSet "+ isAgeFilterSet);
            console.log("Filter minAge "+ minAge);
            console.log("Filter maxAge "+ maxAge);
            console.log("Filter semmai "+ semmai);
            console.log("Filter isHeightFilterSet "+ isHeightFilterSet);
            console.log("Filter minHeight "+ minHeight);
            console.log("Filter maxHeight "+ maxHeight);
            console.log("Filter isIncomeFilerSet "+ isIncomeFilerSet);
            console.log("Filter minIncome "+ minIncome);
            console.log("Filter maxIncome "+ maxIncome);
            console.log("Filter country "+ country);
            console.log("Filter isVerified "+ isVerified);
            // Filter input ends;

            for(var curIteration=0;curIteration<maxIteration; curIteration++)
            {
                console.log("querying data. Limit " + recordsRetrieveCount);
                let prevDocumentSnapShot = undefined;
                let initialCall = false;

                if(startAfterKey != undefined && startAfterKey.length >0)
                {
                    //NOTE - We need to validate this and throw error in case of invalid input.
                    const prevDocument = db.collection('badagaBoys').doc(startAfterKey);
                    prevDocumentSnapShot = await prevDocument.get();
                }
                else
                {
                    initialCall = true;
                }

                console.log("startAfterKey is: " +startAfterKey);
                console.log("initialCall is: " +initialCall);
                

                // Building query start
                let query = db.collection('badagaBoys').orderBy("createdTime", "desc");
                if (initialCall == false)
                {
                    query = query.startAfter(prevDocumentSnapShot);
                }
                query = query.limit(recordsRetrieveCount);
                // Building query end

                var documentCount = 0;
                await query.get().then(querySnapShot =>{
                    
                    for (var i in querySnapShot.docs) {
                        const doc = querySnapShot.docs[i];
                        documentCount++;
                        nextKey = doc.id;

                        // Filtering area starts
                        

                        //Figure out age start:
                        var today = new Date();
                        var birthDate = new Date(doc.data().dob);
                        var age = today.getFullYear() - birthDate.getFullYear();
                        var m = today.getMonth() - birthDate.getMonth();
                        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                            age--;
                        }
                        //Figure out age end;


                        if ((isAgeFilterSet!=undefined && minAge!= undefined && maxAge!=undefined) && 
                            (isAgeFilterSet && (age < minAge || age > maxAge)))
                        {
                            //age does not suite;
                            console.log("age dint match");
                            continue;
                        }

                        if ((isHeightFilterSet != undefined && minHeight!=undefined && maxHeight!=undefined) && 
                            (isHeightFilterSet && (doc.data().height < minHeight || doc.data().height > maxHeight)))
                        {
                            //Height does not suite;
                            console.log("height dint match");
                            continue;
                        }

                        if ((isIncomeFilerSet!=undefined && minIncome!=undefined && maxIncome!=undefined) && 
                            (isIncomeFilerSet && (doc.data().annualIncome < minIncome || doc.data().annualIncome > maxIncome)))
                        {
                            //Income does not suite;
                            console.log("income dint match");
                            continue;
                        }

                        if (
                            (semmai!=undefined && doc.data().semmai != semmai) 
                            || 
                            (country !=undefined && doc.data().country != country) 
                            || 
                            (isVerified!=undefined && doc.data().isVerifiedProfile != isVerified)
                            )
                        {
                            //!SECTION
                            console.log("semmai or country or verified dint match");
                            continue;
                        }

                        // Filtering area ends;

                        response.push({
                            id : doc.id,
                            fullName:doc.data().fullName,
                            age: age,
                            semmai: doc.data().semmai,
                            height: doc.data().height,
                            education: doc.data().education,
                            occupation: doc.data().occupation,
                            isVerifiedProfile: doc.data().isVerifiedProfile,
                            photoUrl: doc.data().photoUrl,
                            hatty: doc.data().hatty,
                            weight: doc.data().weight,
                            maritalStatus: doc.data().maritalStatus,
                            semmai: doc.data().semmai,
                            annualIncome: doc.data().annualIncome
                        });

                        if (response.length >= limit)
                        {
                            console.log("Got desired number of results");
                            break;
                        }

                    }// inner for;

                }) //await

                if (response.length >= limit)
                {
                    // We got desired number of results;
                    break;
                }

                if (documentCount < recordsRetrieveCount)
                {
                    // No records.
                    console.log("No more records");
                    break;
                }

                // Refreshing inputs for next iteration
                recordsRetrieveCount = recordsRetrieveCount * 5;
                startAfterKey = nextKey;

            }//for;

            return res.status(200).send(response);
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

app.post('/api/create', (req, res) => {

    (async () => {
        
        try
        {
            console.log("In create");
            await db.collection('cricket').doc('/'+req.body.id+'/')
            .create({
                name: req.body.name,
                age: req.body.age,
                created: req.body.created,
                matches: req.body.matches
            })

            return res.status(200).send();
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

app.get('/api/read/:id', (req, res) => {

    (async () => {
        
        try
        {
            const document = db.collection('cricket').doc(req.params.id);
            let player = await document.get();
            let response = player.data();

            return res.status(200).send(response);
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

app.get('/api/read', (req, res) => {

    (async () => {
        
        try
        {
            let query = db.collection('cricket');
            let response = [];

            await query.get().then(querySnapShot =>{
                querySnapShot.forEach(
                    doc => {
                        //response.push(doc);
                        
                        response.push({
                            id : doc.id,
                            name:doc.data().name,
                            age: doc.data().age,
                            created: doc.data().created,
                            matches: doc.data().matches
                        });

                    }
                );

            })

            return res.status(200).send(response);
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

app.put('/api/update/:id', (req, res) => {

    (async () => {
        
        try
        {
            console.log("In update");
            const document = db.collection('cricket').doc(req.params.id);

            await document.update({
                name: req.body.name,
                age: req.body.age,
                created: req.body.created,
                matches: req.body.matches
            });

            return res.status(200).send();
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

app.delete('/api/delete/:id', (req, res) => {

    (async () => {
        
        try
        {
            console.log("In update");
            const document = db.collection('cricket').doc(req.params.id);
            await document.delete();
            
            return res.status(200).send();
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

exports.app = functions.https.onRequest(app);

async function getCricketDetailsUtil(startAfterKey, limit)
{
    (async () => {
        let response = [];
        let prevDocumentSnapShot = undefined;
        let lastRowCreatedTime = undefined;
        let initialCall = false;
        if(startAfterKey != undefined && startAfterKey.length >0)
        {
            const prevDocument = db.collection('cricket').doc(startAfterKey);
            prevDocumentSnapShot = await prevDocument.get();
            lastRowCreatedTime = prevDocumentSnapShot.data().created;
        }
        else
        {
            lastRowCreatedTime = new Date().getTime();
            initialCall = true;
        }

        console.log("startAfterKey is: " +startAfterKey);
        console.log("initialCall is: " +initialCall);
        console.log("lastRowCreatedTime is: " +lastRowCreatedTime);

        var query = db.collection("cricket");

        query = query.orderBy("created", "desc");
        //query = query.where("created","<=",lastRowCreatedTime);

        if (initialCall == false)
        {
            query = query.startAfter(prevDocumentSnapShot);
        }
                    
        query = query.limit(limit);

        await query.get().then(snapshot =>{
            snapshot.forEach(doc =>{
                console.log(doc.data());
                //output.push(doc.data());
    
                response.push({
                    id : doc.id,
                    name:doc.data().name,
                    age: doc.data().age,
                    created: doc.data().created,
                    matches: doc.data().matches
                });
    
            });
        });

        console.log("count in util"+response.length);
        return response;
    })();
}

exports.getCricketDetails = onRequest((req,res) => {

    (async () => {
        //Input area:
        var startAfterKey = req.query.startAfterKey;
        var limit = 1;
        var nextKey = undefined;
        //Input area ends;

        //output start
        let response = [];
        var apiResponseLength = 1;
        //output

        try
        {
            var maxIteration=4;
            for(var curIteration=0;curIteration<maxIteration; curIteration++)
            {
                console.log("querying data. Limit " + limit);

                let prevDocumentSnapShot = undefined;
                let lastRowCreatedTime = undefined;
                let initialCall = false;
                if(startAfterKey != undefined && startAfterKey.length >0)
                {
                    const prevDocument = db.collection('cricket').doc(startAfterKey);
                    prevDocumentSnapShot = await prevDocument.get();
                    lastRowCreatedTime = prevDocumentSnapShot.data().created;
                }
                else
                {
                    lastRowCreatedTime = new Date().getTime();
                    initialCall = true;
                }

                console.log("startAfterKey is: " +startAfterKey);
                console.log("initialCall is: " +initialCall);
                console.log("lastRowCreatedTime is: " +lastRowCreatedTime);

                var query = db.collection("cricket");

                query = query.orderBy("created", "desc");
                //query = query.where("created","<=",lastRowCreatedTime);

                if (initialCall == false)
                {
                    query = query.startAfter(prevDocumentSnapShot);
                }
                            
                query = query.limit(limit);

                var curIterationCount = 0;
                await query.get().then(snapshot =>{

                    for (var i in snapshot.docs) {
                        const doc = snapshot.docs[i]
                        
                        curIterationCount++;
                        nextKey = doc.id;

                        console.log(doc.data());

                        if (doc.data().age <40)
                        {
                            continue;
                        }

                        if (doc.data().matches < 200)
                        {
                            continue;
                        }

                        response.push({
                            id : doc.id,
                            name:doc.data().name,
                            age: doc.data().age,
                            created: doc.data().created,
                            matches: doc.data().matches
                        });
                        
                        if (response.length >= apiResponseLength)
                        {
                            console.log("Got desired number of results");
                            //return res.status(200).send(response);
                            break;
                        }
                        
                    }

                    /*snapshot.forEach(doc =>{
                        console.log(doc.data());
                        //output.push(doc.data());
            
                        response.push({
                            id : doc.id,
                            name:doc.data().name,
                            age: doc.data().age,
                            created: doc.data().created,
                            matches: doc.data().matches
                        });
                        
                        if (response.length >= apiResponseLength)
                        {
                            console.log("Got desired number of results");
                            return res.status(200).send(response);
                        }

                    });*/
                }); //awaot


                console.log("count in util"+response.length);

                if (response.length >= apiResponseLength)
                {
                    // We got desired number of results;
                    break;
                }

                if (curIterationCount < limit)
                {
                    // No records.
                    console.log("No more records");
                    break;
                }
                
                // Refreshing the input
                limit = limit * 10;
                startAfterKey = nextKey;
                

            }// for;

        }
        catch(e)
        {
            console.log("Exception occured");
                console.log("stack", e.stack);
                console.log("name", e.name);
                console.log("message", e.message);
            
        }

        res.status(200).send(response);
    })();
});