import { STORAGE_KEYS } from './constants.js';

export class StorageService {
  static getBookmarkedAirdrops() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKED_AIRDROPS) || '[]');
  }

  static setBookmarkedAirdrops(airdrops) {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKED_AIRDROPS, JSON.stringify(airdrops));
  }

  static toggleBookmark(airdropId) {
    const bookmarks = this.getBookmarkedAirdrops();
    const index = bookmarks.indexOf(airdropId);

    if (index > -1) {
      bookmarks.splice(index, 1);
      this.setBookmarkedAirdrops(bookmarks);
      return false;
    } else {
      bookmarks.push(airdropId);
      this.setBookmarkedAirdrops(bookmarks);
      return true;
    }
  }

  static getParticipatingAirdrops() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PARTICIPATING_AIRDROPS) || '[]');
  }

  static setParticipatingAirdrops(airdrops) {
    localStorage.setItem(STORAGE_KEYS.PARTICIPATING_AIRDROPS, JSON.stringify(airdrops));
  }

  static toggleParticipation(airdropId) {
    const participating = this.getParticipatingAirdrops();
    const index = participating.indexOf(airdropId);

    if (index > -1) {
      participating.splice(index, 1);
      this.setParticipatingAirdrops(participating);
      return false;
    } else {
      participating.push(airdropId);
      this.setParticipatingAirdrops(participating);
      return true;
    }
  }
}
