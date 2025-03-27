package csd230.lab2.restControllers.magazineRestControllers;

public class MagazineNotFoundException extends RuntimeException {
    MagazineNotFoundException(Long id) {
        super("Could not find magazine " + id);
    }
}