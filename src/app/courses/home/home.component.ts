import { Component, OnInit } from '@angular/core';
import { compareCourses, Course } from '../model/course';
import { Observable } from 'rxjs';
import { defaultDialogConfig } from '../shared/default-dialog-config';
import { EditCourseDialogComponent } from '../edit-course-dialog/edit-course-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { map, shareReplay } from 'rxjs/operators';
import { CoursesHttpService } from '../services/courses-http.service';
import { CourseState } from '../courses.ngrx.store/courses.reducers';
import { select, Store } from '@ngrx/store';
import { coursesSelectors } from '../courses.ngrx.store/courses.selectors';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  promoTotal$: Observable<number>;

  loading$: Observable<boolean>;

  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;

  constructor(private dialog: MatDialog, private coursesHttpService: CoursesHttpService, private store: Store<CourseState>) {}

  ngOnInit() {
    this.reload();
  }

  reload() {
    const courses$ = this.store.pipe(select(coursesSelectors.selectAllCourses));

    this.loading$ = courses$.pipe(map(courses => !!courses || courses.length === 0));

    this.beginnerCourses$ = this.store.pipe(select(coursesSelectors.selectBeginnerCourses));

    this.advancedCourses$ = this.store.pipe(select(coursesSelectors.selectAdvancedCourses));

    this.promoTotal$ = this.store.pipe(select(coursesSelectors.selectPromoTotal));
  }

  onAddCourse() {
    const dialogConfig = defaultDialogConfig();

    dialogConfig.data = {
      dialogTitle: 'Create Course',
      mode: 'create',
    };

    this.dialog.open(EditCourseDialogComponent, dialogConfig);
  }
}
