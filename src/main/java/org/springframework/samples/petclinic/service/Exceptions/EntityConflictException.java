package org.springframework.samples.petclinic.service.Exceptions;

public class EntityConflictException extends RuntimeException {
   public EntityConflictException(String message)  {
       super(message);
   }
}
