class PhysicsValidator:
    """Ensures extracted values are physically plausible"""
    
    PHYSICAL_BOUNDS = {
        'T_c': {'min': 0, 'max': 300, 'units': 'K'},  # Kelvin
        'H_c2': {'min': 0, 'max': 300, 'units': 'T'},  # Tesla
        'P_c': {'min': 0, 'max': 300, 'units': 'GPa'}, # GigaPascals
    }
    
    def validate_extraction(self, material, properties):
        """Check against known physical limits and material classes"""
        violations = []
        
        for prop, value in properties.items():
            if prop in self.PHYSICAL_BOUNDS:
                bounds = self.PHYSICAL_BOUNDS[prop]
                if not (bounds['min'] <= value <= bounds['max']):
                    violations.append(f"{prop}={value}{bounds['units']} outside range")
        
        # Material-specific validation
        if "La₃Ni₂O₇" in material and properties.get('T_c', 0) > 100:
            violations.append("Unusually high Tc for nickelates - verify")
        
        return {
            'is_valid': len(violations) == 0,
            'violations': violations,
            'confidence_score': self.calculate_confidence(violations, properties)
        }
    
    def calculate_confidence(self, violations, properties):
        """Calculate confidence based on validation results"""
        base_confidence = 1.0
        for violation in violations:
            base_confidence -= 0.1  # Reduce confidence for each violation
        
        # Ensure confidence doesn't go below 0
        return max(0.0, base_confidence)