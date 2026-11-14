import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TutorCard from '../components/TutorCard';
import { tutors } from '../data/tutors';

// Regression-тест до виправлення «зображення карток»:
// фото має вантажитись ліниво і мати розміри, щоб браузер не качав
// усі фото одразу і заздалегідь резервував під них місце.
describe('TutorCard — фото репетитора', () => {
  it('вантажиться ліниво і має задані розміри', () => {
    const tutor = tutors[0];
    render(
      <TutorCard
        tutor={tutor}
        isFavorite={false}
        isSelected={false}
        onSelect={() => {}}
        onToggleFavorite={() => {}}
      />
    );

    const photo = screen.getByAltText(tutor.name);
    expect(photo.getAttribute('loading')).toBe('lazy');
    expect(photo.getAttribute('width')).toBeTruthy();
    expect(photo.getAttribute('height')).toBeTruthy();
  });
});