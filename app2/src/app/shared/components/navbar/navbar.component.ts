import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FlowbiteService } from '../../../core/services/flowbite/flowbite.service';
import { initFlowbite } from 'flowbite';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { CartService } from '../../../core/services/cart/cart.service';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MyTranslateService } from '../../../core/services/myTranslate/my-translate.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private readonly flowbiteService = inject(FlowbiteService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly wishlistService = inject(WishlistService);
  private readonly myTranslateService = inject(MyTranslateService);
  isLoggedIn = computed(() => this.authService.isLogged());
  LoggedInUser = computed(() => this.authService.loggedUser());
  numOfCartItems = computed(() => this.cartService.numOfCartItems());
  numOfWishlistItems = computed(() => this.wishlistService.numOfWishlistItems());
  isOpenlangDropDown = signal<boolean>(false);
  isMenuOpen = signal(false);
  isDropdownOpen = signal(false);
  profileMenu = signal(false);
  searchText = signal<string>('');

  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      if (localStorage.getItem('token')) {
        this.getNumOfCartItems();
        this.getNumOfWishlistItems();
        this.authService.isLogged.set(true);
        this.authService.loggedUser.set(JSON.parse(localStorage.getItem('user')!));
      }
    }
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }

  getNumOfWishlistItems() {
    this.wishlistService.getLoggedUserWishList().subscribe({
      next: (res) => {
        this.wishlistService.numOfWishlistItems.set(res.count);
        this.wishlistService.wishlistProductIds.set(res.data.map((product: any) => product._id));
      },
    });
  }

  getNumOfCartItems() {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this.cartService.numOfCartItems.set(res.numOfCartItems);
      },
    });
  }

  toggleMenu() {
    this.isMenuOpen.update((v) => !v);
    if (!this.isMenuOpen()) {
      this.isDropdownOpen.set(false);
    }
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen.update((v) => !v);
  }

  logOut() {
    this.authService.signOut();
  }

  toggleProfileMenu() {
    this.profileMenu.update((value) => !value);
  }

  closeProfileMenu() {
    this.profileMenu.set(false);
  }

  onSearch(event: SubmitEvent) {
    event.preventDefault();
    const query = this.searchText();
    if (!query.trim()) return;

    this.router.navigate(['/search'], { queryParams: { q: query } });
    this.searchText.set('');
    this.isMenuOpen.set(false);
  }

  closeLangDropDown() {
    this.isOpenlangDropDown.set(false);
  }

  toggleLangDropDown() {
    this.isOpenlangDropDown.set(!this.isOpenlangDropDown());
  }

  changeLanguage(lang: string) {
    this.myTranslateService.changeLanguage(lang);
    this.closeLangDropDown();
  }
}
