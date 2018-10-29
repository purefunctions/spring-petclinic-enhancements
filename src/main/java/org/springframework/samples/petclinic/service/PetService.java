package org.springframework.samples.petclinic.service;

import org.springframework.samples.petclinic.owner.*;
import org.springframework.samples.petclinic.service.Exceptions.BadRequestException;
import org.springframework.samples.petclinic.service.Exceptions.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.Collection;

@Service
public class PetService {
    private final PetRepository petRepository;
    private final OwnerRepository ownerRepository;

    PetService(PetRepository petRepository, OwnerRepository ownerRepository) {
        this.petRepository = petRepository;
        this.ownerRepository = ownerRepository;
    }

    @Transactional
    public Pet findById(Integer petId) {
        Pet pet = petRepository.findById(petId);
        if(pet == null) {
            throw new EntityNotFoundException("Pet with an id " + petId + " not found");
        }
        return pet;
    }

    @Transactional
    public Collection<Pet> findByName(String name) {
        return petRepository.findByName(name);
    }

    @Transactional
    public Collection<PetType> findPetTypes(String name) {
        return petRepository.findPetTypes(name);
    }

    @Transactional
    public Pet createNewPet(String name, LocalDate birthDate, Integer ownerId, Integer petTypeId) {
        Pet pet = new Pet();
        Owner owner = ownerRepository.findById(ownerId);
        if(owner == null) {
            throw new BadRequestException("Given ownerId " + ownerId + " doesn't exist");
        }

        PetType petType = petRepository.findPetType(petTypeId);
        if(petType == null) {
            throw new BadRequestException("Given petTypeId " + petTypeId + " doesn't exist");
        }

        pet.setOwner(owner);
        pet.setName(name);
        pet.setBirthDate(birthDate);
        pet.setType(petType);
        return petRepository.save(pet);
    }
}
