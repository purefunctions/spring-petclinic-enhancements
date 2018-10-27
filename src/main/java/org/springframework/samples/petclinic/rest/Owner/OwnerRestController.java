package org.springframework.samples.petclinic.rest.Owner;

import org.springframework.http.MediaType;
import org.springframework.samples.petclinic.owner.Owner;
import org.springframework.samples.petclinic.owner.Pet;
import org.springframework.samples.petclinic.service.OwnerService;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Collection;
import java.util.Optional;

@CrossOrigin
@RestController
public class OwnerRestController {
    private final OwnerService ownerService;

    OwnerRestController(OwnerService ownerService) {
        this.ownerService = ownerService;
    }

    @GetMapping(value = "/api/v1/owners", produces = MediaType.APPLICATION_JSON_VALUE)
    Collection<Owner> getOwnersByLastName(@RequestParam("lastName") Optional<String> lastName) {
        return ownerService.findOwnersByLastName(lastName.orElse(""));
    }

    @GetMapping(value = "/api/v1/owners/{ownerId}", produces = MediaType.APPLICATION_JSON_VALUE)
    Owner getOwnerById(@PathVariable Integer ownerId) {
        return ownerService.findOwnerById(ownerId);
    }

    @GetMapping(value = "/api/v1/owners/{ownerId}/pets", produces = MediaType.APPLICATION_JSON_VALUE)
    Collection<Pet> getPetsByOwnerId(@PathVariable Integer ownerId) {
        Owner owner = ownerService.findOwnerById(ownerId);
        return owner.getPets();
    }

    @PostMapping(value = "/api/v1/owners/{ownerId}/pets", produces = MediaType.APPLICATION_JSON_VALUE)
    Pet addPet(@PathVariable Integer ownerId, @RequestBody @Valid CreatePetRequest createPetRequest) {
        return ownerService.addPet(
            ownerId,
            createPetRequest.getName(),
            createPetRequest.getBirthDate(),
            createPetRequest.getPetTypeId()
        );
    }
}
