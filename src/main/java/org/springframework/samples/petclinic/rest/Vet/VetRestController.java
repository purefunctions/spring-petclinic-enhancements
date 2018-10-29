package org.springframework.samples.petclinic.rest.Vet;

import org.springframework.http.MediaType;
import org.springframework.samples.petclinic.service.VetService;
import org.springframework.samples.petclinic.vet.Specialty;
import org.springframework.samples.petclinic.vet.Vet;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Collection;
import java.util.Optional;

@CrossOrigin
@RestController
public class VetRestController {
    VetService vetService;

    VetRestController(VetService vetService) {
        this.vetService = vetService;
    }

    @GetMapping(value = "/api/v1/vets", produces = MediaType.APPLICATION_JSON_VALUE)
    Collection<Vet> findVets(@RequestParam Optional<String> lastName) {
        return vetService.findByLastLame(lastName.orElse(""));
    }

    @GetMapping(value = "/api/v1/vet_specialties", produces = MediaType.APPLICATION_JSON_VALUE)
    Collection<Specialty> findSpecialties(@RequestParam Optional<String> name) {
        return vetService.findVetSpecialities(name.orElse(""));
    }

    @GetMapping(value = "/api/v1/vets/{vetId}", produces = MediaType.APPLICATION_JSON_VALUE)
    Vet findVets(@PathVariable Integer vetId) {
        return vetService.findById(vetId);
    }

    @PostMapping(value = "/api/v1/vets", produces = MediaType.APPLICATION_JSON_VALUE)
    Vet findVets(@RequestBody @Valid CreateVetRequest crateVetRequest) {
        return vetService.createNewVet(
            crateVetRequest.getFirstName(),
            crateVetRequest.getLastName(),
            crateVetRequest.getSpecialtyIds()
        );
    }
}
