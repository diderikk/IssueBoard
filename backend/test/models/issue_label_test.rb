# frozen_string_literal: true

require 'test_helper'

class IssueLabelTest < ActiveSupport::TestCase
  test "should not save label when board and name are not unique" do
    issue_label = IssueLabel.new(name: "MyString", color: "test", issue_board: issue_boards(:issue_board1))
    assert_not issue_label.save, "Issue label not saved"
  end
end
