import { ComponentFixture, TestBed } from "@angular/core/testing"
import { AppComponent } from "./app.component"
import { DebugElement } from "@angular/core"
import { UserService } from "./Services/user.service"
import { of } from "rxjs"
import { HeaderComponent } from "./components/header/header.component"
import { AlertboxComponent } from "./components/alertbox/alertbox.component"
import { CommonModule } from "@angular/common"


describe("AppComponent", () => {
    let component: AppComponent
    let fixture: ComponentFixture<AppComponent>
    let debugEle: DebugElement
    let userservice: jasmine.SpyObj<UserService>

    beforeEach(async () => {
        const spyobj = jasmine.createSpyObj<UserService>('UserService', ["notify$"], {
            notify$: of({ alerttype: 'Success', isAlertBoxOpen: true, message: 'Test Message' })
        })


        await TestBed.configureTestingModule({
            imports: [CommonModule],
            declarations: [AppComponent, HeaderComponent, AlertboxComponent],
            providers: [{ provide: UserService, useValue: spyobj }]
        }).compileComponents()

        userservice = TestBed.inject(UserService) as jasmine.SpyObj<UserService>
        fixture = TestBed.createComponent(AppComponent)
        debugEle = fixture.debugElement
        component = fixture.componentInstance;
    })

    xit("should show alert box when service recieves the notification of updation or registration of user", () => {


    })

    it("should create the component", () => {
        expect(component).toBeTruthy()
    })

})