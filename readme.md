# Spring PetClinic Sample with REST interface, React based SPA and additional functionality
[Link to original readme](https://github.com/spring-projects/spring-petclinic/blob/master/readme.md)

# What is this
This is an adaptation of the Spring PetClinic application, modified to add a REST interface to existing functionality as well as use the REST API through a Single Page Application
The functionality added:
* Create appointments for a given Vet and Pet by listing availabilities for a given date
* REST API for the above functionality

Note that the appointments part of the feature was not originally present in the original link above

# How to use
## To run the server:
```
git clone https://github.com/purefunctions/spring-petclinic-enhancements
cd spring-petclinic-enhancements
./mvnw package
java -jar target/*.jar
```
The REST API should be available in [http://localhost:8000/api/v1]()

## To run the client
```
git clone https://github.com/purefunctions/spring-petclinic-enhancements
cd spring-petclinic-enhancements/admin-panel
npm install
npm run start
```
The client should be available in [http://localhost:3000]()

NOTE: Development and testing was done in Windows, but there should be no reason it won't work elsewhere.
NOTE: The source is also available in bitbucket at [https://bitbucket.org/purefunctions/spring-petclinic-enhancements]()

# Overall notes on the implementation
* Main purpose of implementation was as a learning experience and to show how certain parts of the concepts in frameworks can be used
* It was a learning experience as Spring boot was very new to me as well as Java had not been used in a while. Similarly, this is my second front end app
* As a result, even though most of the features that will be used in a typical production application are used, they are not used in all parts of the application
* The scope was also kept limited due to time constraints in development
* Error handling might be rough around the edges, but most important parts should work if front-end and back-end are used together
* Front end may lack some polish and UX design

# Notes on changes in back end
* Most of the original functionality has been left untouched except for some additions and minor changes to the original Spring boot models, repositories, etc
* The server side rendering has been left untouched. New functionality is only available through REST API (i.e. the availabilities and appointments functionality)
* Schema additions and sample data for the new functionality has only been done in HSQL (MySQL schema and sample data is untouched)
* Appointments in database are not limited to any specific duration, but the REST API and other parts of the system assume 30 minute appointments to keep the scope easy (I also wanted to give an ideal amount of time for patients, unlike in real world :))
* Vets are available M-F 8-5. Poor vets do not get any lunch time or holidays (for now! :))
* Vets can't be double booked, unlike in real life
* Other functionality such as individual availability schedules per vet would increase the scope, but can be implemented by changes in service and schema.
* Appointments can be scheduled way into the future. This can of course be limited to a few months ahead of time in future iterations of the development
* Features of Spring boot used: Repository, Query generation, RestController (with CORS for REST), Custom JSON response handling for errors/exceptions, Preliminary validation of request params and body, etc.

# Notes on front end
* React with Typescript and Material UI
* Navigation with React router
* Server operations using Axios
* A redux store is present, but currently not used (look at the appointments redux store) due to lack of time trying to resolve some typescript errors while using dispatch
* Concepts used: redux reducers, selectors, action creators, thunk actions, HOC (Higher order components)
* Tabbed interface
  * Appointments: View pets, vets, and their appointments. Click New Appointment to create new appointments, Clicke cancel appointment to cancel an appointment
  * Vets: Create a new vet
  * Pets: Create a new pet

# If I had more time...
* Individual Vet availability schedules and an interface to update the schedules
* Calendar components
* Unit tests
* More exhaustive validations and error checks
* Flexible appointment durations
* Owner, pets, vets listing
* Date range filter in fetching appointments, etc
* Paging for appointments and other possibly large list of results
* Hook up at least the appointments redux store and create more redux stores and use redux

