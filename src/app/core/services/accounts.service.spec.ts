import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


import { AccountsService } from './accounts.service';

describe('AccountsService', () => {
  let service: AccountsService;
  let httpTesting: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [AccountsService]
    })

    service = TestBed.inject(AccountsService)
    httpTesting = TestBed.inject(HttpTestingController)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
