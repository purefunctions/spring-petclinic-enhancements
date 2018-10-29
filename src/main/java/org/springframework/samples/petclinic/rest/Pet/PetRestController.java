package org.springframework.samples.petclinic.rest.Pet;

import org.springframework.http.MediaType;
import org.springframework.samples.petclinic.owner.Pet;
import org.springframework.samples.petclinic.owner.PetType;
import org.springframework.samples.petclinic.service.PetService;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Collection;
import java.util.Optional;

@CrossOrigin
@RestController
public class PetRestController {
    private final PetService petService;

    PetRestController(PetService petService) {
        this.petService = petService;
    }

    @GetMapping(value = "/api/v1/pets", produces = MediaType.APPLICATION_JSON_VALUE)
    Collection<Pet> findPets(@RequestParam Optional<String> name) {
        return petService.findByName(name.orElse(""));
    }

    @GetMapping(value = "/api/v1/pets/{petId}", produces = MediaType.APPLICATION_JSON_VALUE)
    Pet findPet(@PathVariable Integer petId) {
        return petService.findById(petId);
    }

    @GetMapping(value = "/api/v1/pet_types", produces = MediaType.APPLICATION_JSON_VALUE)
    Collection<PetType> findPetTypes(@RequestParam Optional<String> type) {
        return petService.findPetTypes(type.orElse(""));
    }

    @PostMapping(value = "/api/v1/pets", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    Pet createNewPet(@RequestBody @Valid CreatePetRequest request) {
        return petService.createNewPet(
            request.getName(),
            request.getBirthDate(),
            request.getOwnerId(),
            request.getPetTypeId()
        );
    }
}
