Feature: Homepage
  As a user
  I want to visit the homepage
  So that I can access the various features

  Scenario: Visit Homepage
    Given I am on the homepage
    Then I should see the title be "Template Designer"
    And I should see a "project" tab with heading "Project []"
    And I should see a "groups" tab with heading "Rule Groups [20]"
    And I should see a "rules" tab with heading "Compliance Rules [3]"
    And I should see a "templates" tab with heading "Templates [2]"
    And I should see a "actionview" tab with heading "Action View"
    And I should see a "language" tab with heading "English US [en_US]"
