package org.springframework.samples.petclinic.service;

import org.springframework.samples.petclinic.owner.Pet;
import org.springframework.samples.petclinic.owner.PetRepository;
import org.springframework.samples.petclinic.owner.PetType;
import org.springframework.samples.petclinic.service.Exceptions.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;

@Service
public class PetService {
    private final PetRepository petRepository;

    PetService(PetRepository petRepository) {
        this.petRepository = petRepository;
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
}
