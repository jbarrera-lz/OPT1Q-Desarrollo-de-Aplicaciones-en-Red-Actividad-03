import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogArticleBrief } from './blog-article-brief';

describe('BlogArticleBrief', () => {
  let component: BlogArticleBrief;
  let fixture: ComponentFixture<BlogArticleBrief>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogArticleBrief]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogArticleBrief);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
