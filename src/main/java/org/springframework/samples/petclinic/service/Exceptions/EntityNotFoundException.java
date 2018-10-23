package org.springframework.samples.petclinic.service.Exceptions;

public class EntityNotFoundException extends RuntimeException {
   public EntityNotFoundException(String message)  {
       super(message);
   }
}
