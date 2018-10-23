package org.springframework.samples.petclinic.service;

import org.springframework.samples.petclinic.owner.*;
import org.springframework.samples.petclinic.service.Exceptions.BadRequestException;
import org.springframework.samples.petclinic.service.Exceptions.EntityConflictException;
import org.springframework.samples.petclinic.service.Exceptions.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collection;

@Service
public class OwnerService {
    private final OwnerRepository ownerRepository;
    private final PetRepository petRepository;

    OwnerService(OwnerRepository ownerRepository, PetRepository petRepository) {
        this.ownerRepository = ownerRepository;
        this.petRepository = petRepository;
    }

    public Owner createNewOwner(String firstName, String lastName, String address, String city, String telephone)
    {
        Owner owner = new Owner();
        owner.setFirstName(firstName);
        owner.setLastName(lastName);
        owner.setAddress(address);
        owner.setCity(city);
        owner.setTelephone(telephone);
        return ownerRepository.save(owner);
    }

    public Owner findOwnerById(Integer ownerId) {
        Owner owner = ownerRepository.findById(ownerId);
        if (owner == null) {
            throw new EntityNotFoundException("Owner with id " + ownerId + " not found");
        }
        return owner;
    }

    public Collection<Owner> findOwnersByLastName(String lastName) {
        return ownerRepository.findByLastName(lastName);
    }

    public Pet addPet(Integer ownerId, String name, LocalDate birthDate, Integer typeId) {
        Owner owner = ownerRepository.findById(ownerId);
        if (owner == null) {
            throw new EntityNotFoundException("Owner with id " + ownerId + " not found");
        }

        if (owner.getPet(name, false) != null) {
            throw new EntityConflictException("Pet with name " + name + " already exists for ownerId " + ownerId);
        }

        PetType petType = petRepository.findPetType(typeId);
        if (petType == null) {
            throw new BadRequestException("Pet type with id " + typeId + " not found");
        }

        Pet pet = new Pet();
        pet.setType(petType);
        pet.setBirthDate(birthDate);
        pet.setName(name);
        pet.setOwner(owner);
        return petRepository.save(pet);
    }
}
